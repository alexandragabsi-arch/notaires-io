// Serveur MCP notaires.io — trouver un notaire et prendre rendez-vous depuis
// Claude, ChatGPT, Cursor…
// URL publique : https://notaires.io/api/mcp/mcp (Streamable HTTP, sans connexion)
//
// Principes :
// - Annuaire : mêmes fiches que le site (fiches masquées exclues), présentées
//   sans classement ni recommandation : notaires inscrits (agenda en ligne)
//   d'abord, puis les autres, dans l'ordre de l'annuaire.
// - Rendez-vous : uniquement chez un notaire inscrit, sur un créneau réellement
//   libre de son agenda, après accord explicite de l'utilisateur. Même
//   enregistrement que le site (lib/reservation.ts) : e-mail de confirmation au
//   client (avec lien d'annulation) et notification au notaire.
// - Aucune pièce justificative ne transite par l'assistant.

import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getNotairesByCity, getNotairesByArrondissement, getAllNotaires } from "@/lib/notaires-source";
import { getInscrits, getInscritsVille, avecInscrits } from "@/lib/inscrits-serveur";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { normaliserSpecialites } from "@/lib/specialites";
import { heuresDuJour, aujourdhuiParis, jourDeCle, cleJour, HORIZON_JOURS, lireDisponibilites, disponibilitesParDefaut } from "@/lib/disponibilites";
import { estFicheTest } from "@/lib/fiches-test";
import { slotKeyDepuisJour, estSlotKeyIso, isoCreneau } from "@/lib/creneau";
import { DOSSIERS, ROLES_BY_DOSSIER, DOCS_BY_DOSSIER, DOCS_COMMUNS } from "@/lib/dossiers-rdv";
import { enregistrerReservation } from "@/lib/reservation";
import { limiter } from "@/lib/rate-limit";
import { SITE } from "@/lib/email";

export const maxDuration = 60;

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Service temporairement indisponible.");
  return createClient(url, key);
}

const texte = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const erreur = (t: string) => ({ content: [{ type: "text" as const, text: t }], isError: true });
const msg = (e: unknown) => (e instanceof Error ? e.message : "erreur inconnue");
const cle = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const urlFiche = (id: string) => `${SITE}/notaires/${id}`;

/** Libellé « Mer. 11 juin · 10h00 », comme sur le site. */
function libelleCreneau(slotKey: string): string {
  const d = new Date(slotKey);
  const jour = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "short", day: "numeric", month: "long" }).format(d);
  const heure = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(d).replace(":", "h");
  return `${jour.charAt(0).toUpperCase()}${jour.slice(1)} · ${heure}`;
}

function resume(n: ListingNotaire, reservable: boolean): string {
  const lignes = [
    `• ${n.name}${n.officeName && n.officeName !== n.name ? ` — ${n.officeName}` : ""} (id : ${n.id})`,
    n.address ? `  Adresse : ${n.address}` : `  Ville : ${n.city}`,
    n.role ? `  Fonction : notaire ${n.role}` : "",
    n.specialties?.length ? `  Domaines : ${n.specialties.join(", ")}` : "",
    n.languages?.length ? `  Langues : ${n.languages.join(", ")}` : "",
    n.phone ? `  Téléphone : ${n.phone}` : "",
    reservable ? "  Rendez-vous en ligne : oui (outil creneaux_disponibles)" : "  Rendez-vous en ligne : non — contacter l'étude",
    `  Fiche : ${urlFiche(n.id)}`,
  ];
  return lignes.filter(Boolean).join("\n");
}

async function inscritParId(id: string): Promise<ListingNotaire | undefined> {
  if (estFicheTest(id)) return ficheDemo(id);
  return (await getInscrits()).find((n) => n.id === id);
}

/**
 * Fiche de démonstration (lib/fiches-test.ts) : absente des recherches, mais
 * consultable et réservable par son id, pour les tests et la revue des
 * annuaires de connecteurs, sans déranger un vrai notaire.
 */
async function ficheDemo(id: string): Promise<ListingNotaire | undefined> {
  const { data: r } = await db()
    .from("notaire_profiles")
    .select("id, name, city, office_name, address, specialties, languages, bio, disponibilites")
    .eq("id", id)
    .maybeSingle();
  if (!r) return undefined;
  return {
    id: r.id as string,
    name: r.name as string,
    initials: "T",
    color: "default",
    city: r.city as string,
    officeName: (r.office_name as string) || undefined,
    address: (r.address as string) || undefined,
    specialties: (r.specialties as string[]) || [],
    languages: (r.languages as string[] | null) || undefined,
    bio: (r.bio as string) || undefined,
    disponibilites: lireDisponibilites(r.disponibilites) ?? disponibilitesParDefaut(),
    next: "Sur demande",
    claimed: true,
  };
}

/** Créneaux libres d'un inscrit (ISO), du jour donné sur `jours` jours. */
async function creneauxLibres(n: ListingNotaire, debut: Date, jours: number): Promise<string[]> {
  if (!n.disponibilites) return [];
  const candidats: string[] = [];
  const d = new Date(debut);
  for (let i = 0; i < jours; i++) {
    for (const h of heuresDuJour(n.disponibilites, d)) candidats.push(slotKeyDepuisJour(d, h));
    d.setDate(d.getDate() + 1);
  }
  if (!candidats.length) return [];
  const { data } = await db()
    .from("bookings")
    .select("slot_key")
    .eq("notaire_id", n.id)
    .neq("status", "cancelled")
    .gte("slot_key", candidats[0])
    .lte("slot_key", candidats[candidats.length - 1]);
  const pris = new Set((data ?? []).map((b) => isoCreneau(new Date(b.slot_key as string))));
  return candidats.filter((c) => !pris.has(c));
}

const handler = createMcpHandler(
  (server) => {
    // ─── Recherche ──────────────────────────────────────────────────────────
    server.registerTool(
      "rechercher_notaires",
      {
        title: "Rechercher un notaire",
        description:
          "Trouve des notaires dans une ville française (annuaire notaires.io, données publiques). Filtres facultatifs : arrondissement (Paris, Lyon, Marseille), domaine (immobilier, succession, donation, famille, mariage / PACS, divorce, sociétés), langue parlée, et uniquement les notaires qui prennent rendez-vous en ligne. Les résultats ne sont pas un classement : ne pas recommander un notaire plutôt qu'un autre.",
        inputSchema: {
          ville: z.string().min(2).max(80).describe("Ville, ex. « Lyon », « Saint-Étienne »"),
          arrondissement: z.number().int().min(1).max(20).optional(),
          domaine: z.string().max(60).optional().describe("Ex. « succession », « immobilier », « donation »"),
          langue: z.string().max(40).optional().describe("Ex. « anglais », « arabe » (renseignée seulement par les notaires inscrits)"),
          rdv_en_ligne: z.boolean().optional().describe("true = seulement les notaires avec agenda en ligne"),
          limite: z.number().int().min(1).max(30).optional().describe("Nombre de résultats (défaut 10)"),
        },
        annotations: { title: "Rechercher un notaire", readOnlyHint: true, openWorldHint: false },
      },
      async ({ ville, arrondissement, domaine, langue, rdv_en_ligne, limite }) => {
        try {
          const base = arrondissement ? getNotairesByArrondissement(ville, arrondissement) : getNotairesByCity(ville);
          let inscrits = await getInscritsVille(ville);
          if (arrondissement) inscrits = inscrits.filter((n) => n.arrondissement === arrondissement);
          const idsInscrits = new Set(inscrits.filter((n) => n.disponibilites).map((n) => n.id));
          let liste = avecInscrits(base, inscrits);
          if (domaine) {
            const voulus = new Set(normaliserSpecialites([domaine]).map(cle));
            if (!voulus.size) voulus.add(cle(domaine));
            liste = liste.filter((n) => [...(n.specialties ?? []), ...(n.subSpecialties ?? [])].some((s) => voulus.has(cle(s))));
          }
          if (langue) {
            const l = cle(langue);
            liste = liste.filter((n) => (n.languages ?? []).some((x) => cle(x).startsWith(l.slice(0, 4))));
          }
          if (rdv_en_ligne) liste = liste.filter((n) => idsInscrits.has(n.id));
          if (!liste.length) {
            return texte(`Aucun notaire trouvé à ${ville}${domaine ? ` pour « ${domaine} »` : ""}. Vérifier l'orthographe de la ville, élargir les filtres, ou consulter ${SITE}/annuaire.`);
          }
          const n = limite ?? 10;
          const extrait = liste.slice(0, n);
          return texte([
            `${liste.length} notaire(s) à ${ville}${arrondissement ? ` (${arrondissement}e)` : ""}${domaine ? `, domaine « ${domaine} »` : ""} — ${extrait.length} affiché(s) :`,
            "",
            ...extrait.map((x) => resume(x, idsInscrits.has(x.id))),
            liste.length > n ? `\n… et ${liste.length - n} autre(s) : ${SITE}/annuaire` : "",
          ].join("\n"));
        } catch (e) {
          return erreur(`Recherche indisponible : ${msg(e)}`);
        }
      },
    );

    // ─── Fiche ──────────────────────────────────────────────────────────────
    server.registerTool(
      "fiche_notaire",
      {
        title: "Fiche d'un notaire",
        description: "Détail d'un notaire à partir de son id (obtenu avec rechercher_notaires) : étude, adresse, domaines, langues, présentation, prise de rendez-vous en ligne.",
        inputSchema: { id: z.string().min(3).max(200) },
        annotations: { title: "Fiche d'un notaire", readOnlyHint: true, openWorldHint: false },
      },
      async ({ id }) => {
        try {
          const inscrit = await inscritParId(id);
          const fiche = inscrit ?? getAllNotaires().find((n) => n.id === id);
          if (!fiche) return erreur("Notaire introuvable. Relancer rechercher_notaires pour obtenir un id valide.");
          const reservable = !!inscrit?.disponibilites; // agenda au nouveau format, seul réservable en ligne
          return texte([resume(fiche, reservable), fiche.bio ? `\nPrésentation : ${fiche.bio}` : ""].join("\n"));
        } catch (e) {
          return erreur(`Fiche indisponible : ${msg(e)}`);
        }
      },
    );

    // ─── Types de rendez-vous ───────────────────────────────────────────────
    server.registerTool(
      "types_de_rendez_vous",
      {
        title: "Types de rendez-vous et pièces à préparer",
        description: "Liste les motifs de rendez-vous acceptés à la réservation (achat, vente, succession, donation, mariage / PACS, divorce, société…), les rôles des participants et les pièces à apporter pour chacun.",
        inputSchema: { dossier: z.enum(DOSSIERS as [string, ...string[]]).optional().describe("Un seul motif ; vide = tous") },
        annotations: { title: "Types de rendez-vous et pièces à préparer", readOnlyHint: true, openWorldHint: false },
      },
      async ({ dossier }) => {
        const liste = dossier ? [dossier] : DOSSIERS;
        return texte(liste.map((d) => [
          `■ ${d}`,
          `  Rôles : ${(ROLES_BY_DOSSIER[d] ?? []).join(", ")}`,
          `  Pièces : ${(DOCS_BY_DOSSIER[d] ?? DOCS_COMMUNS).map((p) => `${p.label}${p.required ? " (obligatoire)" : ""}`).join(" ; ")}`,
        ].join("\n")).join("\n\n") + "\n\nLes pièces se transmettent au notaire depuis l'espace client notaires.io ou le jour du rendez-vous, jamais via l'assistant.");
      },
    );

    // ─── Créneaux ───────────────────────────────────────────────────────────
    server.registerTool(
      "creneaux_disponibles",
      {
        title: "Créneaux disponibles d'un notaire",
        description: "Créneaux libres de l'agenda en ligne d'un notaire inscrit (heure de Paris), à partir d'une date. Chaque créneau a un identifiant ISO à passer tel quel à reserver_rendez_vous.",
        inputSchema: {
          id: z.string().min(3).max(200).describe("id du notaire (rechercher_notaires)"),
          a_partir_du: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("AAAA-MM-JJ, défaut : aujourd'hui"),
          jours: z.number().int().min(1).max(21).optional().describe("Nombre de jours à couvrir (défaut 7)"),
        },
        annotations: { title: "Créneaux disponibles d'un notaire", readOnlyHint: true, openWorldHint: false },
      },
      async ({ id, a_partir_du, jours }) => {
        try {
          const n = await inscritParId(id);
          if (!n || !n.disponibilites) {
            return erreur("Ce notaire ne propose pas de rendez-vous en ligne sur notaires.io. Donner ses coordonnées (fiche_notaire) pour contacter l'étude.");
          }
          const auj = aujourdhuiParis();
          const debut = a_partir_du ? jourDeCle(a_partir_du) : auj;
          const ecart = Math.round((debut.getTime() - auj.getTime()) / 86_400_000);
          if (ecart > HORIZON_JOURS) return erreur(`Réservation possible jusqu'à ${HORIZON_JOURS} jours à l'avance.`);
          const libres = await creneauxLibres(n, ecart < 0 ? auj : debut, jours ?? 7);
          if (!libres.length) return texte(`Aucun créneau libre chez ${n.name} sur cette période. Essayer une autre date (a_partir_du) ou une période plus longue.`);
          const parJour = new Map<string, string[]>();
          for (const c of libres) {
            const j = cleJour(new Date(new Date(c).toLocaleString("en-US", { timeZone: "Europe/Paris" })));
            parJour.set(j, [...(parJour.get(j) ?? []), c]);
          }
          return texte([
            `Créneaux libres chez ${n.name} (heure de Paris) :`,
            ...[...parJour.values()].map((cs) => `${libelleCreneau(cs[0]).split(" · ")[0]} : ${cs.map((c) => `${libelleCreneau(c).split(" · ")[1]} [${c}]`).join(", ")}`),
            "",
            "Rendez-vous au cabinet ou en visio. Pour réserver : reserver_rendez_vous avec l'identifiant entre crochets, après accord de l'utilisateur.",
          ].join("\n"));
        } catch (e) {
          return erreur(`Agenda indisponible : ${msg(e)}`);
        }
      },
    );

    // ─── Réservation ────────────────────────────────────────────────────────
    const personne = z.object({
      civilite: z.enum(["M.", "Mme"]),
      prenom: z.string().min(1).max(80),
      nom: z.string().min(1).max(80),
      email: z.string().email(),
      telephone: z.string().min(6).max(30),
    });
    server.registerTool(
      "reserver_rendez_vous",
      {
        title: "Réserver un rendez-vous chez un notaire",
        description:
          "Réserve un créneau libre chez un notaire inscrit. Avant l'appel : récapituler à l'utilisateur notaire, date, heure, modalité, motif et ses coordonnées, et obtenir son accord explicite (confirmation_utilisateur = true). Le client reçoit un e-mail de confirmation avec un lien pour gérer ou annuler ; le notaire est prévenu. Ne jamais réserver pour une autre personne sans qu'elle l'ait demandé.",
        inputSchema: {
          notaire_id: z.string().min(3).max(200),
          creneau: z.string().describe("Identifiant ISO renvoyé par creneaux_disponibles, ex. 2026-11-03T09:30:00Z"),
          dossier: z.enum(DOSSIERS as [string, ...string[]]).describe("Motif du rendez-vous"),
          modalite: z.enum(["cabinet", "visio"]),
          client: personne.describe("Personne qui prend le rendez-vous"),
          role_client: z.string().max(60).optional().describe("Rôle du client (types_de_rendez_vous) ; défaut : le premier rôle du motif"),
          autres_participants: z.array(personne.extend({ role: z.string().max(60) })).max(5).optional(),
          rappel_sms: z.boolean().optional().describe("Rappel par SMS la veille et 2 h avant"),
          confirmation_utilisateur: z.literal(true).describe("true uniquement si l'utilisateur a validé le récapitulatif"),
        },
        annotations: { title: "Réserver un rendez-vous chez un notaire", readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      },
      async ({ notaire_id, creneau, dossier, modalite, client, role_client, autres_participants, rappel_sms }) => {
        try {
          const lim = limiter(`mcp-rdv:${cle(client.email)}`, 3, 60 * 60_000);
          if (!lim.autorise) return erreur("Trop de réservations pour cette adresse e-mail en une heure. Réessayer plus tard.");
          if (!estSlotKeyIso(creneau)) return erreur("Créneau invalide : reprendre l'identifiant ISO donné par creneaux_disponibles.");
          const n = await inscritParId(notaire_id);
          if (!n || !n.disponibilites) return erreur("Ce notaire ne prend pas de rendez-vous en ligne.");
          const slot = isoCreneau(new Date(creneau));
          const auj = aujourdhuiParis();
          const libres = await creneauxLibres(n, auj, HORIZON_JOURS + 1);
          if (!libres.includes(slot)) return erreur("Ce créneau n'est pas (ou plus) disponible. Rappeler creneaux_disponibles et proposer un autre horaire.");
          const roles = ROLES_BY_DOSSIER[dossier] ?? ["Client"];
          const r = await enregistrerReservation(db(), {
            notaireId: n.id,
            notaireNom: n.name,
            slotKey: slot,
            slotLabel: libelleCreneau(slot),
            dossier,
            modalite,
            participants: [
              { ...client, role: role_client || roles[0] },
              ...(autres_participants ?? []),
            ],
            documents: [],
            userId: null,
            smsReminder: !!rappel_sms,
          });
          if (!r.ok) {
            return erreur(r.code === "slot_taken" ? "Ce créneau vient d'être réservé par quelqu'un d'autre. Proposer un autre horaire." : `Réservation impossible : ${r.message}`);
          }
          return texte([
            `Rendez-vous confirmé avec ${n.name} — ${libelleCreneau(slot)} (${modalite === "visio" ? "en visio" : `au cabinet${n.address ? `, ${n.address}` : ""}`}).`,
            `Motif : ${dossier}. Référence : ${r.bookingId}.`,
            `Un e-mail de confirmation a été envoyé à ${client.email} avec le lien pour gérer ou annuler le rendez-vous. Le notaire a été prévenu.`,
            "Pièces à préparer : appeler types_de_rendez_vous pour ce motif.",
          ].join("\n"));
        } catch (e) {
          return erreur(`Réservation indisponible : ${msg(e)}`);
        }
      },
    );
  },
  {
    serverInfo: { name: "notaires-io", version: "0.1.0" },
    instructions:
      "notaires.io est l'annuaire des notaires de France avec prise de rendez-vous en ligne. Parcours : rechercher_notaires (ville, domaine) → fiche_notaire → creneaux_disponibles → récapitulatif validé par l'utilisateur → reserver_rendez_vous. Présenter les notaires sans classement ni recommandation personnelle ; ne pas donner de conseil juridique (renvoyer vers le notaire) ; ne jamais demander de pièce d'identité ni de document.",
  },
  { basePath: "/api/mcp", maxDuration: 60, verboseLogs: false, disableSse: true },
);

export { handler as GET, handler as POST, handler as DELETE };
