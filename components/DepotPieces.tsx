"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Rdv {
  id: string;
  jeton: string;
  ouvert: boolean;
  quand: string;
  notaireNom: string;
  dossier: string | null;
}

/** Dépôt de pièces par un participant : chaque fichier rejoint directement le rendez-vous. */
export default function DepotPieces({ rdv }: { rdv: Rdv | null }) {
  const [nom, setNom] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [recus, setRecus] = useState<string[]>([]);
  const [erreur, setErreur] = useState("");

  if (!rdv) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-16 text-center">
        <h1 className="serif text-[28px] font-bold text-[var(--color-text-strong)] mb-3">Lien invalide</h1>
        <p className="text-[15px] text-[var(--color-muted)]">
          Ce lien ne correspond à aucun rendez-vous, ou il a été modifié.
        </p>
      </div>
    );
  }

  async function appel(corps: Record<string, unknown>) {
    const res = await fetch("/api/rdv/pieces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rdv!.id, t: rdv!.jeton, nom, ...corps }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error((json?.error as string) || "L'envoi n'a pas abouti. Réessayez.");
    return json as { path?: string; jeton?: string };
  }

  async function deposer(fichiers: FileList) {
    setErreur("");
    if (!nom.trim()) {
      setErreur("Indiquez d'abord votre nom.");
      return;
    }
    setEnvoi(true);
    try {
      for (const fichier of Array.from(fichiers)) {
        const { path, jeton } = await appel({ etape: "preparer", fileName: fichier.name, taille: fichier.size });
        const { error } = await supabase.storage
          .from("booking-documents")
          .uploadToSignedUrl(path!, jeton!, fichier, { contentType: fichier.type || undefined });
        if (error) throw new Error(`« ${fichier.name} » n'a pas pu être envoyé. Réessayez.`);
        await appel({ etape: "confirmer", fileName: fichier.name, path });
        setRecus((r) => [...r, fichier.name]);
      }
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-10 sm:py-14">
      <h1 className="serif text-[28px] sm:text-[32px] font-bold text-[var(--color-text-strong)] mb-6">
        Déposer mes documents
      </h1>

      <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 bg-[var(--color-tint-blue)]">
          <CalendarClock className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
          <span className="text-[14px] font-semibold text-[var(--color-primary)] first-letter:uppercase">{rdv.quand}</span>
        </div>

        <div className="px-5 sm:px-6 py-5 flex flex-col gap-4">
          <div>
            <div className="text-[17px] font-bold text-[var(--color-text-strong)]">{rdv.notaireNom}</div>
            {rdv.dossier && <div className="text-[13px] text-[var(--color-muted)]">{rdv.dossier}</div>}
          </div>

          {!rdv.ouvert ? (
            <p className="text-[14px] text-[var(--color-muted)] text-justify">
              Ce rendez-vous est passé ou annulé : le dépôt de documents est fermé.
            </p>
          ) : (
            <>
              <p className="text-[14px] text-[var(--color-muted)] text-justify">
                Vos documents sont rattachés à ce rendez-vous et transmis au notaire ainsi qu&apos;à la personne qui
                l&apos;a pris. Aucun compte n&apos;est nécessaire.
              </p>

              <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-[var(--color-text-strong)]">
                Votre nom
                <input
                  type="text"
                  value={nom}
                  maxLength={120}
                  autoComplete="name"
                  onChange={(e) => setNom(e.target.value)}
                  className="border border-[var(--color-border-soft)] rounded-[10px] px-3 py-2.5 text-[15px] font-normal"
                />
              </label>

              <label
                className={`inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold ${
                  envoi ? "opacity-70 cursor-wait" : "cursor-pointer"
                }`}
              >
                {envoi ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> : <Upload className="w-4 h-4" strokeWidth={2.5} />}
                {envoi ? "Envoi en cours…" : "Choisir mes documents"}
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
                  className="hidden"
                  disabled={envoi}
                  onChange={(e) => {
                    if (e.target.files?.length) deposer(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="text-[12px] text-[var(--color-muted)]">PDF, JPG, PNG, HEIC ou Word, 15 Mo maximum par fichier.</p>

              {erreur && <p role="alert" className="text-[14px] font-semibold text-red-600">{erreur}</p>}

              {recus.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {recus.map((f, i) => (
                    <div key={`${f}-${i}`} className="flex items-center gap-2 text-[13px] text-[var(--color-text-strong)] bg-[var(--color-tint-blue)] rounded-[10px] px-3 py-2">
                      <FileText className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                      <span className="font-medium truncate flex-1">{f}</span>
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" strokeWidth={2.5} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
