interface Crumb {
  href?: string;
  label: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="bg-[var(--color-tint-blue)] border-b border-[var(--color-border-soft)]"
    >
      <ol className="max-w-[1200px] mx-auto px-6 py-3 text-[13px] text-[var(--color-muted)] flex items-center gap-2 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>›</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-[var(--color-accent)] transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-[var(--color-text-strong)] truncate">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
