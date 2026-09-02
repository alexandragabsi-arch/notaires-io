"use client";

import { useEffect, useState } from "react";
import { CreditCard, Truck, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrix, getCardType } from "@/lib/cartes";

type Commande = {
  id: string;
  card_type: string;
  quantity: number;
  amount_cents: number;
  status: string;
  tracking_url: string | null;
  error: string | null;
  created_at: string;
};

/** Traduit les statuts, les nôtres comme ceux de l'imprimeur. */
function libelle(status: string): { texte: string; ton: "attente" | "route" | "souci" } {
  const s = status.toLowerCase();
  if (s.includes("error")) return { texte: "Problème — nous vous recontactons", ton: "souci" };
  if (s.includes("cancel")) return { texte: "Annulée", ton: "souci" };
  if (s.includes("deliver")) return { texte: "Livrée", ton: "route" };
  if (s.includes("ship")) return { texte: "Expédiée", ton: "route" };
  if (s.includes("print") || s.includes("production")) return { texte: "En cours d'impression", ton: "attente" };
  if (s === "draft") return { texte: "En préparation", ton: "attente" };
  return { texte: "Commande enregistrée", ton: "attente" };
}

export default function CommandesCartes({ notaireId }: { notaireId: string }) {
  const [commandes, setCommandes] = useState<Commande[] | null>(null);

  useEffect(() => {
    let annule = false;
    supabase
      .from("card_orders")
      .select("id, card_type, quantity, amount_cents, status, tracking_url, error, created_at")
      .eq("notaire_id", notaireId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!annule) setCommandes((data as Commande[]) ?? []);
      });
    return () => { annule = true; };
  }, [notaireId]);

  // Tant qu'aucune commande n'a été passée, la section n'a rien à dire.
  if (!commandes || commandes.length === 0) return null;

  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7">
      <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-5">
        <CreditCard className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
        Mes commandes de cartes
      </div>

      <div className="flex flex-col gap-3">
        {commandes.map((c) => {
          const { texte, ton } = libelle(c.error ? "error" : c.status);
          const type = getCardType(c.card_type);
          const Icone = ton === "route" ? Truck : ton === "souci" ? AlertTriangle : Clock;
          const couleur =
            ton === "route"
              ? "text-[var(--color-success)] bg-[var(--color-tint-green)]"
              : ton === "souci"
                ? "text-[var(--color-danger)] bg-[var(--color-tint-rose)]"
                : "text-[var(--color-accent)] bg-[var(--color-tint-blue)]";

          return (
            <div
              key={c.id}
              className="flex flex-wrap items-center gap-3 border border-[var(--color-border-soft)] rounded-2xl px-4 py-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${couleur}`}>
                <Icone className="w-4 h-4" strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[var(--color-text-strong)] tabular-nums">
                  {c.quantity} cartes {type?.label ?? c.card_type}
                </div>
                <div className="text-[12.5px] text-[var(--color-muted)]">
                  {new Date(c.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                  })}{" "}
                  · {formatPrix(c.amount_cents)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[12.5px] font-medium text-[var(--color-text-strong)]">{texte}</span>
                {c.tracking_url && (
                  <a
                    href={c.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    Suivre
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
