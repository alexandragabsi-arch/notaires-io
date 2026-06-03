import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { EDITEUR, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité (RGPD) | Notaires.io",
  description:
    "Comment Notaires.io collecte, utilise et protège vos données personnelles, conformément au RGPD. Vos droits et nos engagements.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      intro="Protection de vos données personnelles, conformément au Règlement général sur la protection des données (RGPD)."
      updated={LEGAL_UPDATED}
    >
      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données est la société{" "}
        <strong>{EDITEUR.societe}</strong>, éditrice du site{" "}
        {EDITEUR.marque}, dont le siège est situé {EDITEUR.adresse}. Pour toute
        question relative à vos données, vous pouvez écrire à{" "}
        <a href={`mailto:${EDITEUR.dpoEmail}`}>{EDITEUR.dpoEmail}</a>.
      </p>

      <h2>2. Données que nous collectons</h2>
      <p>
        Nous appliquons le principe de minimisation : nous ne collectons que les
        données nécessaires au service.
      </p>
      <h3>Pour les particuliers (prise de rendez-vous)</h3>
      <ul>
        <li>Identité : nom, prénom ;</li>
        <li>Coordonnées : adresse e-mail, numéro de téléphone ;</li>
        <li>Localisation : code postal / ville ;</li>
        <li>
          Objet du rendez-vous : nature de votre besoin (ex. immobilier,
          succession, famille) et informations que vous choisissez de préciser
          pour préparer le rendez-vous.
        </li>
      </ul>
      <h3>Pour les notaires (inscription)</h3>
      <ul>
        <li>Identité et coordonnées professionnelles ;</li>
        <li>Informations sur l'étude : nom, adresse, spécialités ;</li>
        <li>Éléments de profil public : photo et présentation (facultatifs).</li>
      </ul>
      <p>
        Certaines informations liées à votre situation (par exemple une
        succession ou un divorce) peuvent être sensibles. Vous les communiquez
        librement, uniquement pour permettre au notaire de préparer votre
        rendez-vous, et elles ne sont utilisées qu'à cette fin.
      </p>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>
          <strong>Mise en relation et prise de rendez-vous</strong> — base
          légale : exécution de mesures prises à votre demande / contrat.
        </li>
        <li>
          <strong>Envoi des confirmations et rappels de rendez-vous</strong>{" "}
          (e-mail) — base légale : exécution du service demandé.
        </li>
        <li>
          <strong>Référencement du profil du notaire</strong> dans l'annuaire —
          base légale : exécution du contrat avec le notaire.
        </li>
        <li>
          <strong>Amélioration et sécurité du service</strong> — base légale :
          intérêt légitime.
        </li>
      </ul>

      <h2>4. Destinataires des données</h2>
      <p>
        Vos données sont communiquées au notaire que vous choisissez, afin de
        traiter votre rendez-vous. Elles peuvent également être traitées par nos
        prestataires techniques (hébergement, envoi d'e-mails), qui agissent
        sur instruction et pour le compte de {EDITEUR.societe}. Nous ne vendons
        jamais vos données.
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>
          Données de rendez-vous : conservées le temps nécessaire au traitement,
          puis archivées ou supprimées selon les obligations légales ;
        </li>
        <li>
          Compte notaire : conservé pendant la durée de la relation, puis
          supprimé sur demande ;
        </li>
        <li>
          Données strictement nécessaires aux obligations légales et comptables :
          conservées selon les durées prévues par la loi.
        </li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez des droits d'accès, de
        rectification, d'effacement, de limitation, d'opposition et de
        portabilité de vos données. Vous pouvez les exercer à tout moment en
        écrivant à{" "}
        <a href={`mailto:${EDITEUR.dpoEmail}`}>{EDITEUR.dpoEmail}</a>. Vous
        pouvez également introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        ).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Le site utilise uniquement les cookies strictement nécessaires à son
        fonctionnement. Nous n'utilisons pas de cookies publicitaires ni de
        traceurs tiers à des fins de profilage. Si cela devait évoluer, un
        bandeau de consentement vous serait présenté.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles
        appropriées pour protéger vos données contre tout accès, perte ou
        divulgation non autorisés. La confidentialité est au cœur du métier de
        notaire — et de notre plateforme.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question concernant cette politique ou l'exercice de vos
        droits :{" "}
        <a href={`mailto:${EDITEUR.dpoEmail}`}>{EDITEUR.dpoEmail}</a>.
      </p>
    </LegalLayout>
  );
}
