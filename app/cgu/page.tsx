import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { EDITEUR, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | Notaires.io",
  description:
    "Conditions générales d'utilisation du site Notaires.io : objet du service, rôle de la plateforme, obligations et responsabilités.",
  alternates: { canonical: "/cgu" },
};

export default function CguPage() {
  return (
    <LegalLayout
      title="Conditions générales d'utilisation"
      intro="Les présentes conditions régissent l'utilisation du site et des services Notaires.io."
      updated={LEGAL_UPDATED}
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d'utilisation (« CGU ») définissent
        les modalités d'accès et d'utilisation du site {EDITEUR.marque}, édité
        par {EDITEUR.societe}. En utilisant le site, vous acceptez les présentes
        CGU.
      </p>

      <h2>2. Description du service</h2>
      <p>
        Notaires.io est une plateforme de <strong>mise en relation</strong> et
        de prise de rendez-vous entre des particuliers et des notaires. Le
        service permet de rechercher un notaire, de préciser l'objet de sa
        demande et de réserver un rendez-vous, en présentiel ou en
        visioconférence.
      </p>

      <h2>3. Rôle de la plateforme</h2>
      <p>
        Notaires.io agit uniquement en qualité d'intermédiaire technique.
        Notaires.io n'est pas un office notarial, ne fournit aucun conseil
        juridique et ne réalise aucun acte. Les conseils, consultations et actes
        relèvent exclusivement de la responsabilité du notaire choisi, dans le
        respect de sa déontologie. La tarification des actes notariés demeure
        celle fixée par la réglementation applicable.
      </p>

      <h2>4. Accès et tarification</h2>
      <p>
        Le premier rendez-vous via Notaires.io est <strong>offert et limité à
        30 minutes</strong>. Il permet au particulier de poser ses questions,
        de comprendre sa situation et de décider de la suite avec le notaire.
        Si un acte notarié est nécessaire, les honoraires sont dus directement
        au notaire, selon la tarification réglementée applicable à la
        prestation. La création d'un profil notaire est réservée aux
        professionnels habilités. Vous vous engagez à fournir des informations
        exactes et à jour, et à préserver la confidentialité de vos
        identifiants.
      </p>

      <h2>5. Obligations de l'utilisateur</h2>
      <ul>
        <li>Fournir des informations exactes et licites ;</li>
        <li>
          Utiliser le service conformément à sa finalité et à la
          réglementation ;
        </li>
        <li>
          Ne pas perturber le fonctionnement du site ni porter atteinte aux
          droits de tiers.
        </li>
      </ul>

      <h2>6. Responsabilité</h2>
      <p>
        Notaires.io s'efforce d'assurer la disponibilité et l'exactitude du
        service, sans garantie d'absence d'interruption ou d'erreur. La
        responsabilité de {EDITEUR.societe} ne saurait être engagée du fait du
        contenu des échanges entre l'utilisateur et le notaire, ni du fait des
        prestations réalisées par le notaire.
      </p>

      <h2>7. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments du site est protégé par le droit de la propriété
        intellectuelle et reste la propriété de {EDITEUR.societe}. Toute
        utilisation non autorisée est interdite.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <a href="/confidentialite">Politique de confidentialité</a>.
      </p>

      <h2>9. Modification et résiliation</h2>
      <p>
        {EDITEUR.societe} peut faire évoluer le service et les présentes CGU. Les
        modifications prennent effet dès leur publication. Vous pouvez cesser
        d'utiliser le service à tout moment ; un notaire peut demander la
        suppression de son profil.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Les présentes CGU sont régies par le droit français. En cas de litige,
        et à défaut de résolution amiable, les tribunaux compétents seront ceux
        du ressort du siège de {EDITEUR.societe}.
      </p>

      <h2>11. Contact</h2>
      <p>
        Pour toute question :{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </p>
    </LegalLayout>
  );
}
