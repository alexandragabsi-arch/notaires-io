import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { EDITEUR, HEBERGEUR, LEGAL_UPDATED } from "@/lib/legal";

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
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
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
        <li>Informations sur l’étude : nom, adresse, spécialités ;</li>
        <li>Éléments de profil public : photo et présentation (facultatifs).</li>
      </ul>
      <p>
        Certaines informations liées à votre situation (par exemple une
        succession ou un divorce) peuvent être sensibles. Vous les communiquez
        librement, uniquement pour permettre au notaire de préparer votre
        rendez-vous, et elles ne sont utilisées qu’à cette fin.
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
          <strong>Référencement du profil du notaire</strong> dans l’annuaire —
          base légale : exécution du contrat avec le notaire.
        </li>
        <li>
          <strong>Amélioration et sécurité du service</strong> — base légale :
          intérêt légitime.
        </li>
      </ul>

      <h2>4. Destinataires et sous-traitants</h2>
      <p>
        Vos données sont communiquées au notaire que vous choisissez, afin de
        traiter votre rendez-vous. Elles sont par ailleurs hébergées et traitées
        par les prestataires suivants, qui agissent sur instruction et pour le
        compte de {EDITEUR.societe}. Nous ne vendons jamais vos données et ne les
        utilisons à aucune fin publicitaire.
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — hébergement de la base de données,
          authentification des comptes et stockage des pièces que vous déposez.
          Vos données sont stockées sur des serveurs situés dans l’Union
          européenne (Stockholm, Suède) ;
        </li>
        <li>
          <strong>Vercel Inc.</strong> ({HEBERGEUR.adresse}) — hébergement du
          site ;
        </li>
        <li>
          <strong>Resend</strong> — envoi des e-mails de confirmation et de
          rappel de rendez-vous ;
        </li>
        <li>
          <strong>Stripe</strong> — paiement et facturation de l’abonnement des
          notaires (aucune donnée bancaire ne transite par nos serveurs) ;
        </li>
        <li>
          <strong>Anthropic</strong> — assistant d’orientation (voir section 9) ;
        </li>
        <li>
          <strong>Jitsi Meet</strong> — visioconférence, lorsque vous choisissez
          ce mode de rendez-vous ;
        </li>
        <li>
          <strong>API Adresse (DINUM, api-adresse.data.gouv.fr)</strong> —
          reconnaissance de la commune saisie ou détectée (voir section 10) ;
        </li>
        <li>
          <strong>api.qrserver.com</strong> — génération des QR codes des fiches
          notaires (aucune donnée de client n’y est transmise).
        </li>
      </ul>
      <p>
        <strong>Transferts hors Union européenne.</strong> La base de données et
        les pièces que vous déposez restent hébergées dans l’Union européenne.
        En revanche, plusieurs prestataires — notamment Vercel, Anthropic,
        Resend et Stripe — sont
        établis aux États-Unis ou y opèrent une partie de leurs traitements. Ces
        transferts sont encadrés par les clauses contractuelles types de la
        Commission européenne et, le cas échéant, par la certification du
        prestataire au Data Privacy Framework. Vous pouvez nous demander le
        détail des garanties applicables à l’adresse {EDITEUR.email}.
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>
          Données de rendez-vous : conservées le temps nécessaire au traitement,
          puis archivées ou supprimées selon les obligations légales ;
        </li>
        <li>
          Comptes (particulier comme notaire) : conservés pendant la durée de la
          relation, et supprimables à tout moment depuis la rubrique « Mon
          compte » de votre espace personnel ;
        </li>
        <li>
          Données strictement nécessaires aux obligations légales et comptables :
          conservées selon les durées prévues par la loi.
        </li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez des droits d’accès, de
        rectification, d’effacement, de limitation, d’opposition et de
        portabilité de vos données. Vous pouvez les exercer à tout moment en
        écrivant à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </p>
      <p>
        <strong>Suppression de votre compte.</strong> Vous pouvez la déclencher
        vous-même, sans nous écrire, depuis la rubrique « Mon compte » de votre
        espace personnel. Votre compte et vos identifiants sont alors supprimés,
        vos coordonnées et celles des autres parties sont effacées de vos
        rendez-vous et les pièces que vous aviez déposées sont détruites. Le
        notaire conserve la trace du rendez-vous, sans donnée permettant de vous
        identifier, pour les besoins de son dossier.
      </p>
      <p>
        Vous
        pouvez également introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        ).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Le site utilise uniquement les cookies strictement nécessaires à son
        fonctionnement. Nous n’utilisons pas de cookies publicitaires ni de
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

      <h2>9. Assistant d’orientation</h2>
      <p>
        L’assistant accessible depuis le menu vous permet de décrire votre
        situation en quelques mots pour être orienté vers la bonne spécialité et
        la bonne ville. Le texte que vous saisissez est transmis à{" "}
        <strong>Anthropic</strong> (États-Unis), dont le modèle a pour unique
        rôle de <strong>classer votre demande</strong> dans l’une de nos
        catégories (immobilier, famille, société, document). Aucun conseil
        juridique n’est produit, aucune décision automatisée n’est prise à votre
        égard, et l’échange n’est pas conservé sous forme de conversation.
      </p>
      <p>
        Ces messages peuvent contenir des informations sensibles (décès,
        séparation, patrimoine) : ne saisissez que ce qui est nécessaire pour
        être orienté. Vous pouvez utiliser l’annuaire et prendre rendez-vous sans
        jamais passer par l’assistant.
      </p>

      <h2>10. Géolocalisation</h2>
      <p>
        Certaines pages vous proposent de trouver un notaire près de chez vous.
        Cette fonction n’est <strong>jamais activée automatiquement</strong> :
        elle suppose que vous cliquiez sur le bouton correspondant, puis que vous
        acceptiez la demande de votre navigateur. Vos coordonnées sont alors
        envoyées à l’<strong>API Adresse</strong> de l’État français
        (api-adresse.data.gouv.fr) dans le seul but d’en déduire votre commune.
        Elles ne sont ni enregistrées, ni associées à votre compte.
      </p>

      <h2>11. Fiches de l’annuaire des notaires</h2>
      <p>
        L’annuaire recense les notaires et études à partir d’informations
        <strong> publiquement accessibles</strong>, notamment l’annuaire officiel
        du notariat et les données ouvertes de l’État (base Sirene, API Recherche
        d’entreprises). Ces fiches ne comportent que des données professionnelles :
        nom d’exercice, office, adresse et coordonnées professionnelles,
        spécialités.
      </p>
      <p>
        Tant qu’une fiche n’a pas été revendiquée par son titulaire, elle est
        signalée comme telle, ses coordonnées directes sont masquées et aucune
        prise de rendez-vous n’est possible. Tout notaire peut demander à tout
        moment la rectification, la limitation ou la suppression de sa fiche, ou
        s’opposer à sa publication, en écrivant à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a> — sa demande
        est traitée sans avoir à être motivée.
      </p>

      <h2>12. Contact</h2>
      <p>
        Pour toute question concernant cette politique ou l’exercice de vos
        droits :{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </p>
    </LegalLayout>
  );
}
