import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  MapPin,
  Clock,
  LifeBuoy,
  Smartphone,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EDITEUR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aide & support | Notaires.io",
  description:
    "Centre d’aide Notaires.io : poser une question, contacter le support, gérer son compte, son abonnement notaire ou ses données personnelles.",
  alternates: { canonical: "/support" },
};

// Questions les plus fréquentes, côté particulier puis côté notaire.
// Rendu en <details> natif pour garder la page en Server Component.
const FAQ_PARTICULIER: { q: string; a: React.ReactNode }[] = [
  {
    q: "Comment prendre rendez-vous avec un notaire ?",
    a: (
      <>
        Recherchez une étude depuis l’
        <Link href="/annuaire">annuaire</Link>, ouvrez sa fiche, choisissez un
        créneau puis confirmez. Vous recevez immédiatement un e-mail de
        confirmation, et un rappel avant le rendez-vous.
      </>
    ),
  },
  {
    q: "Comment modifier ou annuler mon rendez-vous ?",
    a: (
      <>
        Depuis votre <Link href="/espace-client">espace client</Link>, onglet
        « Mes rendez-vous ». Vous pouvez aussi répondre à l’e-mail de
        confirmation, ou écrire à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </>
    ),
  },
  {
    q: "Comment se déroule un rendez-vous en visioconférence ?",
    a: (
      <>
        Le lien de la visio apparaît dans votre espace client et dans l’e-mail
        de confirmation. Il s’ouvre directement dans l’application ou le
        navigateur, sans installation ni création de compte supplémentaire.
      </>
    ),
  },
  {
    q: "Je ne trouve pas mon notaire dans l’annuaire.",
    a: (
      <>
        L’annuaire s’enrichit en continu. Écrivez-nous à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a> en indiquant le
        nom et la ville de l’étude : nous l’ajoutons sous 48 heures ouvrées.
      </>
    ),
  },
  {
    q: "J’ai oublié mon mot de passe.",
    a: (
      <>
        Utilisez le lien{" "}
        <Link href="/mot-de-passe-oublie">Mot de passe oublié</Link> sur l’écran
        de connexion. Vous recevrez un e-mail de réinitialisation valable
        une heure.
      </>
    ),
  },
];

const FAQ_NOTAIRE: { q: string; a: React.ReactNode }[] = [
  {
    q: "Comment référencer mon étude ?",
    a: (
      <>
        Créez votre profil depuis la page{" "}
        <Link href="/inscription">Référencer mon étude</Link>. La connexion
        notaire se fait avec votre adresse officielle en <code>@notaires.fr</code>{" "}
        (ou un sous-domaine de votre étude, par exemple{" "}
        <code>@paris.notaires.fr</code>).
      </>
    ),
  },
  {
    q: "Comment gérer ou résilier mon abonnement ?",
    a: (
      <>
        Depuis votre <Link href="/espace-notaire">espace notaire</Link>, section
        « Facturation ». Si l’abonnement a été souscrit dans l’application iOS,
        la résiliation se fait dans <strong>Réglages → votre nom → Abonnements</strong>{" "}
        sur votre iPhone ou iPad. Les conditions figurent dans nos{" "}
        <Link href="/cgv">CGV</Link>.
      </>
    ),
  },
  {
    q: "Comment modifier mes horaires et mes créneaux ?",
    a: (
      <>
        Dans l’espace notaire, section « Disponibilités ». Les modifications
        sont visibles immédiatement par les particuliers, sur le site comme dans
        l’application.
      </>
    ),
  },
];

const FAQ_COMPTE: { q: string; a: React.ReactNode }[] = [
  {
    q: "Comment supprimer mon compte et mes données ?",
    a: (
      <>
        Depuis les paramètres de votre compte (espace client ou espace notaire),
        bouton « Supprimer mon compte ». La suppression est définitive et
        entraîne l’effacement de vos données, sous réserve des durées de
        conservation légales détaillées dans notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>. Vous
        pouvez aussi en faire la demande à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </>
    ),
  },
  {
    q: "Comment exercer mes droits RGPD ?",
    a: (
      <>
        Accès, rectification, effacement, portabilité, opposition : écrivez à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>. Nous
        répondons sous un mois maximum, conformément au RGPD.
      </>
    ),
  },
  {
    q: "Signaler un problème technique ou un contenu inexact.",
    a: (
      <>
        Écrivez à <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a> en
        précisant l’appareil utilisé (iPhone, iPad, navigateur) et, si possible,
        une capture d’écran. Nous traitons les signalements sous 48 heures
        ouvrées.
      </>
    ),
  },
];

function FaqBlock({
  title,
  items,
}: {
  title: string;
  items: { q: string; a: React.ReactNode }[];
}) {
  return (
    <div className="mb-10">
      <h2 className="serif text-[22px] sm:text-[26px] font-bold text-[var(--color-text-strong)] tracking-tight mb-4">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group border border-[var(--color-border-soft)] rounded-2xl bg-white overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-[15px] sm:text-[16px] text-[var(--color-text-strong)] flex items-center justify-between gap-4">
              {item.q}
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center text-[18px] leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-[15px] leading-relaxed text-[var(--color-muted)] [&_a]:text-[var(--color-accent)] [&_a]:font-semibold hover:[&_a]:underline [&_code]:text-[13px] [&_code]:bg-[var(--color-tint-blue)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-[860px] mx-auto px-6">
            <div className="inline-flex items-center gap-2 text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
              <LifeBuoy className="w-4 h-4" />
              Aide &amp; support
            </div>
            <h1 className="serif text-[30px] sm:text-[40px] font-bold text-[var(--color-text-strong)] tracking-tight mb-3">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-[var(--color-muted)] text-[16px] leading-relaxed max-w-[620px] mb-10">
              Une question sur un rendez-vous, votre compte, votre abonnement ou
              vos données ? Écrivez-nous : une personne de l’équipe vous répond,
              du lundi au vendredi.
            </p>

            {/* Bloc de contact — le point d'entrée exigé par l'App Store.
                Une seule adresse : contact@notaires.io couvre aussi le RGPD. */}
            <a
              href={`mailto:${EDITEUR.email}`}
              className="block border border-[var(--color-border-soft)] rounded-2xl p-6 bg-[var(--color-tint-blue)] hover:border-[var(--color-accent)] transition-colors mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[15px] text-[var(--color-text-strong)] mb-1">
                    Nous écrire
                  </div>
                  <div className="text-[18px] sm:text-[20px] font-bold text-[var(--color-accent)] break-all">
                    {EDITEUR.email}
                  </div>
                  <p className="text-[14px] text-[var(--color-muted)] mt-2 leading-relaxed">
                    Rendez-vous, compte, application, abonnement, suppression de
                    compte et droits RGPD — une seule adresse pour tout.
                  </p>
                </div>
              </div>
            </a>

            {/* Ce que couvre le support, en un coup d'œil */}
            <div className="grid sm:grid-cols-3 gap-3 mb-12">
              {[
                {
                  icon: LifeBuoy,
                  titre: "Rendez-vous",
                  texte: "Prise, modification, annulation, visioconférence.",
                },
                {
                  icon: Smartphone,
                  titre: "Compte et abonnement",
                  texte: "Connexion, mot de passe, facturation, résiliation.",
                },
                {
                  icon: ShieldCheck,
                  titre: "Données personnelles",
                  texte: "Accès, rectification, suppression du compte.",
                },
              ].map(({ icon: Icon, titre, texte }) => (
                <div
                  key={titre}
                  className="border border-[var(--color-border-soft)] rounded-2xl p-5 bg-white"
                >
                  <Icon className="w-5 h-5 text-[var(--color-accent)] mb-3" />
                  <div className="font-bold text-[14px] text-[var(--color-text-strong)] mb-1">
                    {titre}
                  </div>
                  <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                    {texte}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-[var(--color-muted)] mb-12">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                Réponse sous 48 heures ouvrées
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                Site web, iPhone et iPad
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                {EDITEUR.societe}, {EDITEUR.adresse}
              </div>
            </div>

            <FaqBlock title="Particuliers" items={FAQ_PARTICULIER} />
            <FaqBlock title="Notaires et études" items={FAQ_NOTAIRE} />
            <FaqBlock title="Compte et données personnelles" items={FAQ_COMPTE} />

            <div className="border-t border-[var(--color-border-soft)] pt-6 text-[14px] text-[var(--color-muted)]">
              Vous n’avez pas trouvé de réponse ? Écrivez à{" "}
              <a
                href={`mailto:${EDITEUR.email}`}
                className="text-[var(--color-accent)] font-semibold hover:underline"
              >
                {EDITEUR.email}
              </a>{" "}
              — nous revenons vers vous rapidement. Voir aussi les{" "}
              <Link
                href="/mentions-legales"
                className="text-[var(--color-accent)] font-semibold hover:underline"
              >
                mentions légales
              </Link>
              , les{" "}
              <Link
                href="/cgu"
                className="text-[var(--color-accent)] font-semibold hover:underline"
              >
                CGU
              </Link>{" "}
              et la{" "}
              <Link
                href="/confidentialite"
                className="text-[var(--color-accent)] font-semibold hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
