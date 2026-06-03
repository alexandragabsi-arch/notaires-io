"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Loader2, ArrowRight } from "lucide-react";

type Message =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; branchId?: string; q2?: string | null };

const SUGGESTIONS = [
  "Mon père vient de décéder, que dois-je faire ?",
  "Je veux acheter un appartement à Paris",
  "Je veux créer une SCI avec mon conjoint",
  "Je divorce, comment partager notre maison ?",
];

export default function AIAssistantPanel({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Bonjour ! Décrivez-moi votre situation en quelques mots — je vous oriente vers le bon notaire et la bonne spécialité.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/detect-besoin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text.trim() }),
      });
      const data = await res.json() as { branchId?: string; q2?: string | null; message?: string; error?: string };
      if (data.error || !data.branchId) {
        setMessages((m) => [
          ...m,
          { role: "assistant", text: "Pouvez-vous préciser votre situation ? Par exemple : \"Mon père est décédé\", \"Je veux acheter un appartement\", \"Je me marie bientôt\"…" },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", text: data.message ?? "Voici ce que je vous recommande.", branchId: data.branchId, q2: data.q2 },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Connexion impossible. Vérifiez votre réseau et réessayez." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed top-[72px] right-4 z-50 w-[360px] max-h-[calc(100vh-96px)] bg-white rounded-2xl shadow-[0_16px_60px_rgba(28,69,135,0.18)] border border-[var(--color-border-soft)] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--color-border-soft)] bg-gradient-to-r from-purple-50 to-blue-50 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-[var(--color-accent)] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-[var(--color-text-strong)] leading-tight">
            Assistant IA · Notaires.io
          </div>
          <div className="text-[11px] text-[var(--color-muted)]">Orientation notariale gratuite</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full hover:bg-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-muted)] transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[86%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-cta text-white rounded-br-md"
                  : "bg-[var(--color-tint-blue)] text-[var(--color-text-strong)] rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
            {m.role === "assistant" && m.branchId && (
              <a
                href="/#hero"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-accent)] hover:underline mt-0.5"
              >
                Prendre RDV maintenant
                <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
              </a>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start">
            <div className="bg-[var(--color-tint-blue)] px-3.5 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-[var(--color-accent)] animate-spin" strokeWidth={2.5} />
              <span className="text-[12px] text-[var(--color-muted)]">Analyse en cours…</span>
            </div>
          </div>
        )}

        {/* Suggestions (première ouverture) */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-col gap-1.5 mt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="text-left text-[12px] px-3 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-strong)] hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-[var(--color-border-soft)] bg-white shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Décrivez votre situation…"
            rows={2}
            className="flex-1 resize-none px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-[13px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!input.trim() || loading}
            className="w-9 h-9 bg-gradient-to-br from-purple-600 to-[var(--color-accent)] text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 shadow-[0_3px_10px_rgba(147,51,234,0.3)]"
          >
            <Send className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
