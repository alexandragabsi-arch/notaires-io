import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mise en page commune des pages légales (mentions, confidentialité, CGU).
// Le bloc « prose » stylise le contenu sémantique passé en children.
export default function LegalLayout({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-[760px] mx-auto px-6">
            <h1 className="serif text-[30px] sm:text-[40px] font-bold text-[var(--color-text-strong)] tracking-tight mb-2">
              {title}
            </h1>
            {intro && (
              <p className="text-[var(--color-muted)] text-[15px] sm:text-[16px] mb-3">
                {intro}
              </p>
            )}
            <p className="text-[13px] text-[var(--color-muted)] mb-10">
              Dernière mise à jour : {updated}
            </p>
            <div
              className="
                text-[15px] leading-relaxed text-[var(--color-muted)]
                [&_h2]:serif [&_h2]:text-[20px] [&_h2]:sm:text-[22px] [&_h2]:font-bold [&_h2]:text-[var(--color-text-strong)] [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3
                [&_h3]:font-bold [&_h3]:text-[16px] [&_h3]:text-[var(--color-text-strong)] [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:mb-4 [&_p]:text-justify [&_p]:hyphens-auto
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                [&_li]:mb-1.5
                [&_a]:text-[var(--color-accent)] [&_a]:font-semibold hover:[&_a]:underline
                [&_strong]:text-[var(--color-text-strong)] [&_strong]:font-semibold
              "
            >
              {children}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
