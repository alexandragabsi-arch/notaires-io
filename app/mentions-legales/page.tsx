import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { EDITEUR, HEBERGEUR, BASE_DE_DONNEES, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales | Notaires.io",
  description:
    "Mentions légales du site Notaires.io : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      title="Mentions légales"
      intro="Informations relatives à l'éditeur et à l'hébergeur du site Notaires.io."
      updated={LEGAL_UPDATED}
    >
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>{EDITEUR.marque}</strong> est édité par la société{" "}
        <strong>{EDITEUR.societe}</strong>, {EDITEUR.formeJuridique}
        {EDITEUR.capital ? ` au capital de ${EDITEUR.capital}` : ""}.
      </p>
      <ul>
        <li>Siège social : {EDITEUR.adresse}</li>
        <li>Immatriculation : {EDITEUR.rcs}</li>
        <li>SIREN : {EDITEUR.siren}</li>
        <li>N° TVA intracommunautaire : {EDITEUR.tva}</li>
        <li>
          Contact :{" "}
          <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>
        </li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        Le directeur de la publication est le représentant légal de la société{" "}
        {EDITEUR.societe}.
      </p>

      <h2>3. Hébergement et localisation des données</h2>
      <p>
        Le site est hébergé par <strong>{HEBERGEUR.nom}</strong>, {HEBERGEUR.adresse}.
        Les pages et les traitements du site sont exécutés depuis ses serveurs
        de <strong>{HEBERGEUR.serveurs}</strong>.
      </p>
      <p>
        La base de données, les comptes et les photos des notaires sont hébergés
        par <strong>{BASE_DE_DONNEES.nom}</strong>, {BASE_DE_DONNEES.adresse}, sur
        ses serveurs de <strong>{BASE_DE_DONNEES.serveurs}</strong>.
      </p>
      <p>
        Ces deux prestataires sont des sociétés de droit américain : leurs serveurs
        sont situés dans l&apos;Union européenne, leur siège ne l&apos;est pas. Les
        transferts éventuels vers les États-Unis sont encadrés par les clauses
        contractuelles types de la Commission européenne. Deux autres sous-traitants
        interviennent : <strong>Stripe</strong> (paiement des abonnements) et{" "}
        <strong>Resend</strong> (envoi des e-mails).
      </p>

      <h2>4. Nature du service</h2>
      <p>
        Notaires.io est une plateforme de mise en relation et de prise de
        rendez-vous entre des particuliers et des notaires. Notaires.io n’est
        pas un office notarial et ne réalise aucun acte notarié. Les
        consultations, conseils et actes relèvent de la seule responsabilité du
        notaire choisi par l’utilisateur.
      </p>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        L’ensemble des éléments du site (marque, logo, textes, visuels,
        interface, code) est protégé par le droit de la propriété
        intellectuelle et reste la propriété exclusive de {EDITEUR.societe} ou
        de ses partenaires. Toute reproduction ou représentation, totale ou
        partielle, sans autorisation préalable, est interdite.
      </p>

      <h2>6. Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <a href="/confidentialite">Politique de confidentialité</a>. Pour toute
        question, vous pouvez écrire à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </p>

      <h2>7. Contact</h2>
      <p>
        Pour toute question relative au site, vous pouvez nous contacter à
        l’adresse <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </p>
    </LegalLayout>
  );
}
