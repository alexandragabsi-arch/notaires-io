"use client";

import { useState } from "react";
import { ArrowRight, BadgeCheck, CheckCircle2, Lock, PhoneCall, Video } from "lucide-react";
import ChampPiege from "@/components/ChampPiege";
import { CHAMP_PIEGE } from "@/lib/rate-limit";
import { OBJETS_LEAD } from "@/lib/leads-visiteurs";
import type { ListingNotaire } from "@/lib/notaires-listing";

/**
 * Encadré de la fiche d'un notaire NON inscrit : la réservation y est
 * impossible, on propose donc d'être recontacté (table leads_visiteurs, via
 * /api/leads-visiteurs), puis quelques notaires inscrits chez qui réserver
 * tout de suite. Seuls des inscrits sont listés, et jamais de décompte.
 */
export default function DemandeRappel({
  notaire,
  suggestions,
}: {
  notaire: Pick<ListingNotaire, "id" | "name" | "city">;
  /** 2 à 3 notaires inscrits : même ville ou département, sinon visio. */
  suggestions: ListingNotaire[];
}) {
  const [champs, setChamps] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    objet: "",
    ville: notaire.city ?? "",
    message: "",
  });
  const [consentement, setConsentement] = useState(false);
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<"saisie" | "envoi" | "envoye">("saisie");
  const [erreur, setErreur] = useState<string | null>(null);

  const maj = (k: keyof typeof champs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setChamps((c) => ({ ...c, [k]: e.target.value }));

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    if (!consentement) {
      setErreur("Merci de cocher la case d'accord pour que nous puissions transmettre votre demande.");
      return;
    }
    setEtat("envoi");
    try {
      const res = await fetch("/api/leads-visiteurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...champs,
          notaireFicheId: notaire.id,
          pageUrl: window.location.href.slice(0, 500),
          consentement: true,
          [CHAMP_PIEGE]: piege,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; erreur?: string };
      if (!res.ok || !json.ok) {
        setErreur(json.erreur ?? "Envoi impossible pour le moment, réessayez plus tard.");
        setEtat("saisie");
        return;
      }
      setEtat("envoye");
    } catch {
      setErreur("Connexion impossible, vérifiez votre réseau et réessayez.");
      setEtat("saisie");
    }
  }

  const champ =
    "w-full rounded-[10px] border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-[14.5px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)]";
  const etiquette = "block text-[12.5px] font-semibold text-[var(--color-text-strong)] mb-1";

  return (
    <section
      aria-labelledby="demande-rappel-titre"
      className="mb-6 rounded-3xl border-2 border-[var(--color-accent)] bg-white shadow-[var(--shadow-card)] overflow-hidden"
    >
      {/* En-tête : pourquoi on ne peut pas réserver ici */}
      <div className="flex items-start gap-3 bg-[var(--color-tint-blue)] px-5 sm:px-7 py-4 border-b border-[var(--color-border-soft)]">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-slate-400" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[15px] text-[var(--color-text-strong)]">
            Ce notaire ne prend pas encore de rendez-vous en ligne
          </p>
          <p className="text-[13px] text-[var(--color-muted)] leading-snug text-justify">
            Laissez-nous vos coordonnées : nous transmettons votre demande à {notaire.name}.
          </p>
        </div>
      </div>

      <div className="grid gap-6 px-5 sm:px-7 py-5 sm:py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* ── Formulaire ── */}
        <div>
          <h2 id="demande-rappel-titre" className="serif text-[21px] sm:text-[23px] font-bold text-[var(--color-text-strong)] mb-4">
            Être recontacté par {notaire.name}
          </h2>

          {etat === "envoye" ? (
            <div role="status" className="flex items-start gap-3 rounded-2xl bg-[var(--color-tint-green)] px-4 py-4">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[var(--color-success)]" strokeWidth={2.5} />
              <div>
                <p className="font-bold text-[14.5px] text-[var(--color-text-strong)]">Demande bien reçue</p>
                <p className="text-[13.5px] text-[var(--color-muted)] leading-relaxed text-justify">
                  Merci {champs.prenom}. Votre demande a été transmise : vous serez recontacté par {notaire.name} ou, à défaut, par un autre notaire,
                  par e-mail{champs.telephone ? " ou par téléphone" : ""} dans les meilleurs délais.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={envoyer} noValidate={false} className="relative grid gap-3.5 sm:grid-cols-2">
              <ChampPiege value={piege} onChange={setPiege} />
              <div>
                <label htmlFor="lead-prenom" className={etiquette}>Prénom</label>
                <input id="lead-prenom" required maxLength={80} autoComplete="given-name" value={champs.prenom} onChange={maj("prenom")} className={champ} />
              </div>
              <div>
                <label htmlFor="lead-nom" className={etiquette}>Nom</label>
                <input id="lead-nom" required maxLength={120} autoComplete="family-name" value={champs.nom} onChange={maj("nom")} className={champ} />
              </div>
              <div>
                <label htmlFor="lead-email" className={etiquette}>E-mail</label>
                <input id="lead-email" type="email" required maxLength={254} autoComplete="email" value={champs.email} onChange={maj("email")} className={champ} />
              </div>
              <div>
                <label htmlFor="lead-tel" className={etiquette}>
                  Téléphone <span className="font-normal text-[var(--color-muted)]">(facultatif)</span>
                </label>
                <input id="lead-tel" type="tel" maxLength={30} autoComplete="tel" value={champs.telephone} onChange={maj("telephone")} className={champ} />
              </div>
              <div>
                <label htmlFor="lead-objet" className={etiquette}>Objet</label>
                <select id="lead-objet" required value={champs.objet} onChange={maj("objet")} className={champ}>
                  <option value="" disabled>Choisissez…</option>
                  {OBJETS_LEAD.map((o) => (
                    <option key={o.valeur} value={o.valeur}>{o.libelle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lead-ville" className={etiquette}>Ville</label>
                <input id="lead-ville" maxLength={120} autoComplete="address-level2" value={champs.ville} onChange={maj("ville")} className={champ} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="lead-message" className={etiquette}>
                  Message <span className="font-normal text-[var(--color-muted)]">(facultatif)</span>
                </label>
                <textarea id="lead-message" rows={3} maxLength={2000} value={champs.message} onChange={maj("message")} className={`${champ} resize-y`} />
              </div>
              <label className="sm:col-span-2 flex items-start gap-2.5 text-[13px] text-[var(--color-muted)] leading-snug text-justify cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentement}
                  onChange={(e) => setConsentement(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[var(--color-accent)]"
                />
                <span>
                  J&apos;accepte que Notaires.io transmette ma demande à {notaire.name} ou, à défaut, à un autre notaire, pour être recontacté.{" "}
                  <a href="/confidentialite" target="_blank" className="font-semibold text-[var(--color-accent)] underline underline-offset-2 hover:no-underline">
                    Politique de confidentialité
                  </a>
                </span>
              </label>
              {erreur && (
                <p role="alert" className="sm:col-span-2 text-[13px] font-semibold text-[var(--color-danger)]">{erreur}</p>
              )}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={etat === "envoi"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] disabled:opacity-60 transition-transform hover:-translate-y-0.5"
                >
                  <PhoneCall className="w-4 h-4" strokeWidth={2.5} />
                  {etat === "envoi" ? "Envoi…" : "Être recontacté par ce notaire"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Inscrits disponibles tout de suite ── */}
        {suggestions.length > 0 && (
          <aside className="rounded-2xl bg-[var(--color-tint-blue)] border border-[var(--color-border-soft)] p-4 sm:p-5 self-start">
            <p className="font-bold text-[14px] text-[var(--color-text-strong)] mb-3 text-justify">
              Ou prenez rendez-vous tout de suite avec un notaire disponible
            </p>
            <ul className="flex flex-col gap-2.5">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/notaires/${encodeURIComponent(s.id)}`}
                    className="flex items-center gap-3 rounded-xl bg-white border border-[var(--color-border-soft)] p-3 hover:border-[var(--color-primary)] transition-colors"
                  >
                    {s.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.photo} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <span className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-[14px] bg-gradient-cta">
                        {s.initials}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-[13.5px] font-semibold text-[var(--color-text-strong)] truncate">
                        <span className="truncate">{s.name}</span>
                        <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2.5} />
                      </span>
                      <span className="flex items-center gap-1 text-[12px] text-[var(--color-muted)] truncate">
                        <Video className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                        {s.city} · visio ou cabinet
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-[var(--color-accent)]" strokeWidth={2.5} />
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {/* Lien discret pour le titulaire de la fiche (nofollow). */}
      <p className="px-5 sm:px-7 pb-4 text-[12.5px] text-[var(--color-muted)]">
        Vous êtes {notaire.name || "le titulaire de cette fiche"} ?{" "}
        <a
          href={`/inscription?claim=${notaire.id}`}
          rel="nofollow"
          className="font-semibold text-[var(--color-accent)] underline underline-offset-2 hover:no-underline"
        >
          Activez votre profil
        </a>
      </p>
    </section>
  );
}
