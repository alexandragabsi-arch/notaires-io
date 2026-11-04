import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { emailButton, emailLayout, sendEmail, SITE } from "@/lib/email";
import { emailDuNotaire } from "@/lib/email-notaire";
import { dateLongue, echapper } from "@/lib/emails/confirmation-rdv";
import { jetonDepotValide } from "@/lib/lien-rdv";
import { limiter, ipDe } from "@/lib/rate-limit";

// Dépôt d'une pièce par un participant, sans compte, depuis le lien signé de son e-mail.
// Le fichier part directement vers le stockage (la limite de taille des fonctions Vercel
// bloquerait les scans) : « preparer » délivre une adresse d'envoi à usage unique,
// « confirmer » rattache le fichier au rendez-vous et prévient le client et le notaire.
// Chemin notaire/<rdv>/… : les règles d'accès existantes l'ouvrent déjà à ces deux-là.

const BUCKET = "booking-documents";
const TAILLE_MAX = 15 * 1024 * 1024;
const MAX_DEPOTS = 20;
const EXTENSIONS = /\.(pdf|jpe?g|png|heic|docx?)$/i;

interface Piece {
  id: string;
  label: string;
  fileName: string;
  path?: string;
  sentAt?: number;
}

const erreur = (message: string, status: number) => NextResponse.json({ error: message }, { status });

export async function POST(req: NextRequest) {
  const limite = limiter(`rdv-pieces:${ipDe(req)}`, 30, 60_000);
  if (!limite.autorise) return erreur("Trop de demandes. Réessayez dans un instant.", 429);

  const corps = (await req.json().catch(() => ({}))) as {
    etape?: string; id?: string; t?: string; nom?: string; fileName?: string; taille?: number; path?: string;
  };
  const { etape, id, t } = corps;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return erreur("Rendez-vous introuvable.", 400);
  if (!jetonDepotValide(id, t)) return erreur("Lien invalide ou expiré.", 403);

  const nom = (corps.nom ?? "").trim().slice(0, 120);
  const fileName = (corps.fileName ?? "").trim().slice(0, 200);
  if (!nom) return erreur("Indiquez votre nom.", 400);
  if (!EXTENSIONS.test(fileName)) return erreur("Formats acceptés : PDF, JPG, PNG, HEIC, Word.", 400);

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: b } = await db
    .from("bookings")
    .select("id, status, slot_key, notaire_id, notaire_nom, client_email, documents")
    .eq("id", id)
    .maybeSingle();
  if (!b) return erreur("Rendez-vous introuvable.", 404);
  if (b.status === "cancelled") return erreur("Ce rendez-vous est annulé.", 409);
  if (b.slot_key && Date.parse(b.slot_key) <= Date.now()) return erreur("Ce rendez-vous est déjà passé.", 409);

  const pieces: Piece[] = Array.isArray(b.documents) ? b.documents : [];
  const prefixe = `notaire/${id}/participant-`;

  if (etape === "preparer") {
    if (typeof corps.taille !== "number" || corps.taille <= 0 || corps.taille > TAILLE_MAX) {
      return erreur("Chaque fichier doit faire moins de 15 Mo.", 413);
    }
    if (pieces.filter((p) => p.path?.startsWith(prefixe)).length >= MAX_DEPOTS) {
      return erreur("Le nombre maximum de pièces est atteint.", 409);
    }
    const nomSur = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${prefixe}${crypto.randomUUID()}-${nomSur}`;
    const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      console.error("[rdv/pieces] Préparation impossible :", error?.message);
      return erreur("L'envoi n'a pas pu démarrer. Réessayez.", 500);
    }
    return NextResponse.json({ path, jeton: data.token });
  }

  if (etape !== "confirmer") return erreur("Demande invalide.", 400);

  const path = corps.path ?? "";
  if (!path.startsWith(prefixe) || path.slice(prefixe.length).includes("/")) return erreur("Fichier invalide.", 400);
  if (pieces.some((p) => p.path === path)) return NextResponse.json({ success: true });

  // Vérifie le fichier réellement reçu : la taille annoncée vient du navigateur.
  const nomFichier = path.split("/").pop()!;
  const { data: trouves } = await db.storage.from(BUCKET).list(`notaire/${id}`, { search: nomFichier, limit: 1 });
  const fichier = trouves?.find((f) => f.name === nomFichier);
  if (!fichier) return erreur("Le fichier n'a pas été reçu. Réessayez.", 400);
  if (Number(fichier.metadata?.size ?? 0) > TAILLE_MAX) {
    await db.storage.from(BUCKET).remove([path]);
    return erreur("Chaque fichier doit faire moins de 15 Mo.", 413);
  }

  const { error } = await db
    .from("bookings")
    .update({
      documents: [...pieces, { id: crypto.randomUUID(), label: `Déposé par ${nom}`, fileName, path, sentAt: Date.now() }],
    })
    .eq("id", id);
  if (error) {
    console.error("[rdv/pieces] Enregistrement impossible :", error.message);
    return erreur("La pièce n'a pas pu être enregistrée. Réessayez.", 500);
  }

  const quand = b.slot_key ? ` du ${dateLongue(b.slot_key)}` : "";
  const message = (lien: string, texte: string) =>
    emailLayout(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 18px;color:#1C4587">Nouvelle pièce au dossier</h1>
      <p style="font-size:15px;color:#3d4a66;margin:0 0 22px;text-align:justify">${echapper(nom)} a déposé « ${echapper(fileName)} » pour le rendez-vous${echapper(quand)} avec ${echapper(b.notaire_nom)}.</p>
      ${emailButton(lien, texte)}
    `);
  const sujet = `Nouvelle pièce pour le rendez-vous${quand}`;
  const emailNotaire = await emailDuNotaire(db, b.notaire_id);
  if (emailNotaire) await sendEmail(emailNotaire, sujet, message(`${SITE}/espace-notaire`, "Voir le dossier"));
  if (b.client_email) await sendEmail(b.client_email, sujet, message(`${SITE}/espace-client`, "Voir mon rendez-vous"));

  return NextResponse.json({ success: true });
}
