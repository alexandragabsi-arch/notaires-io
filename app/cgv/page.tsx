import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { EDITEUR, LEGAL_UPDATED } from "@/lib/legal";

// Conditions générales de vente de l’abonnement notaire.
//
// Cette page était référencée depuis le tunnel de paiement Stripe
// (app/api/subscribe/route.ts → custom_text[terms_of_service_acceptance])
// alors qu’elle n’existait pas : le notaire acceptait des conditions
// pointant vers un lien mort. Les montants ci-dessous sont repris à
// l’identique de la session Checkout (119 € HT/mois, période d’essai de
// 2 mois via subscription_data[trial_end], TVA via Stripe Tax).

export const metadata: Metadata = {
  title: "Conditions générales de vente | Notaires.io",
  description:
    "Conditions générales de vente de l’abonnement Notaires.io destiné aux notaires : prix, durée, facturation, résiliation.",
  alternates: { canonical: "/cgv" },
};

export default function CgvPage() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      intro="Les présentes conditions régissent l’abonnement souscrit par les notaires et les études sur Notaires.io."
      updated={LEGAL_UPDATED}
    >
      <h2>1. Objet et champ d’application</h2>
      <p>
        Les présentes conditions générales de vente (« CGV ») encadrent la
        souscription à l’abonnement {EDITEUR.marque}, édité par{" "}
        <strong>{EDITEUR.societe}</strong>, {EDITEUR.rcs}, dont le siège est situé{" "}
        {EDITEUR.adresse}.
      </p>
      <p>
        L’abonnement est réservé aux <strong>professionnels du notariat</strong> —
        notaires, notaires associés ou salariés, et offices notariaux — agissant
        dans le cadre de leur activité professionnelle. Il ne s’adresse pas aux
        consommateurs. La prise de rendez-vous par les particuliers reste
        gratuite et relève des{" "}
        <a href="/cgu">conditions générales d’utilisation</a>.
      </p>
      <p>
        La souscription vaut acceptation sans réserve des présentes CGV, qui
        complètent les CGU. En cas de contradiction, les CGV prévalent pour ce qui
        concerne l’abonnement.
      </p>

      <h2>2. Contenu de l’abonnement</h2>
      <p>L’abonnement donne accès, pour l’étude concernée, à :</p>
      <ul>
        <li>
          la revendication et l’administration de la fiche de l’étude dans
          l’annuaire, avec affichage des coordonnées et badge de profil vérifié ;
        </li>
        <li>
          l’agenda de prise de rendez-vous en ligne et la réception des demandes ;
        </li>
        <li>
          l’espace notaire : suivi des rendez-vous, échange de pièces avec les
          clients, export des fiches au format CSV, QR code de l’étude, factures ;
        </li>
        <li>
          les rendez-vous en visioconférence et les e-mails automatiques de
          confirmation et de rappel adressés aux clients.
        </li>
      </ul>
      <p>
        {EDITEUR.marque} est un <strong>outil de mise en relation et de gestion
        de rendez-vous</strong>. La plateforme n’est pas un office notarial, ne
        délivre aucun conseil juridique et ne perçoit aucun émolument. Elle ne
        garantit aucun volume de rendez-vous ni aucun résultat commercial.
      </p>

      <h2>3. Prix</h2>
      <ul>
        <li>
          Tarif de l’abonnement : <strong>119 € HT par mois</strong> et par étude.
        </li>
        <li>
          Tarif jeune notaire : <strong>99 € HT par mois</strong>, réservé aux
          notaires installés depuis <strong>moins de trois ans</strong>. Cette
          qualité fait l’objet d’une <strong>attestation sur l’honneur</strong>
          lors de la souscription ; un justificatif de nomination peut être
          demandé à tout moment, et le tarif standard s’applique à défaut, sans
          préjudice de la régularisation des mois déjà facturés.
        </li>
        <li>
          Offre de lancement : <strong>les deux premiers mois d’abonnement sont
          offerts</strong>. Aucune somme n’est prélevée pendant cette période ;
          le tarif de 119 € HT par mois s’applique ensuite.
        </li>
        <li>
          La <strong>TVA au taux en vigueur</strong> (20 % en France
          métropolitaine) s’ajoute à ces montants et est calculée
          automatiquement lors du paiement.
        </li>
      </ul>
      <p>
        Les prix peuvent être révisés. Toute évolution est notifiée par e-mail au
        moins <strong>trente jours</strong> avant sa prise d’effet ; à défaut de
        résiliation avant cette date, le nouveau tarif s’applique à l’échéance
        suivante.
      </p>

      <h2>4. Souscription et paiement</h2>
      <p>
        La souscription s’effectue en ligne. Le paiement est traité par{" "}
        <strong>Stripe Payments Europe</strong> : aucune donnée de carte bancaire
        n’est collectée ni conservée par {EDITEUR.societe}.
      </p>
      <p>
        En validant sa souscription, l’abonné enregistre un moyen de paiement et
        autorise le <strong>prélèvement mensuel automatique</strong> sur
        celui-ci. Au titre de l’offre de lancement,{" "}
        <strong>aucune somme n’est prélevée pendant les deux premiers mois</strong> :
        le premier prélèvement intervient au terme de cette période, puis à
        chaque date anniversaire mensuelle. L’abonné peut résilier avant ce
        terme sans qu’aucun montant ne soit dû. Les factures sont mises à
        disposition dans l’espace notaire.
      </p>
      <p>
        En cas d’échec de paiement, l’accès aux fonctions payantes peut être
        suspendu après relance restée sans effet. La fiche de l’étude revient
        alors à l’état non revendiqué.
      </p>

      <h2>5. Durée et résiliation</h2>
      <p>
        L’abonnement est conclu pour une <strong>durée d’un mois, renouvelable
        par tacite reconduction</strong>. Il est <strong>résiliable à tout
        moment</strong>, sans frais ni préavis.
      </p>
      <p>
        La résiliation s’effectue par simple demande adressée à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a> depuis l’adresse
        professionnelle rattachée au compte. Elle prend effet{" "}
        <strong>à la fin de la période mensuelle en cours</strong> : l’abonné
        conserve l’accès jusqu’à cette date et aucun prélèvement ultérieur n’est
        opéré. Les sommes déjà réglées au titre du mois entamé ne donnent pas lieu
        à remboursement au prorata.
      </p>
      <p>
        La suppression du compte depuis l’espace notaire n’emporte pas
        résiliation de l’abonnement : celle-ci doit être demandée séparément,
        au préalable.
      </p>
      <p>
        {EDITEUR.societe} peut résilier l’abonnement en cas de manquement grave,
        notamment d’usage frauduleux, de fourniture d’informations
        professionnelles inexactes ou d’atteinte aux droits de tiers, après mise
        en demeure restée sans effet pendant quinze jours.
      </p>

      <h2>6. Droit de rétractation</h2>
      <p>
        L’abonnement étant souscrit par un professionnel pour les besoins de son
        activité, le droit de rétractation de quatorze jours prévu par le code de
        la consommation ne s’applique pas. La possibilité de résilier à tout
        moment, prévue à l’article 5, tient lieu de garantie équivalente.
      </p>

      <h2>7. Obligations de l’abonné</h2>
      <ul>
        <li>
          garantir l’exactitude des informations professionnelles publiées, en
          particulier son identité, son office et son numéro CRPCEN ;
        </li>
        <li>
          n’utiliser le service que dans le respect des règles déontologiques de
          la profession notariale ;
        </li>
        <li>
          maintenir son agenda à jour et honorer les rendez-vous acceptés ;
        </li>
        <li>
          préserver la confidentialité des pièces transmises par les clients et
          n’en faire usage que pour le dossier concerné.
        </li>
      </ul>

      <h2>8. Responsabilité</h2>
      <p>
        {EDITEUR.societe} est tenue d’une obligation de moyens quant à la
        disponibilité du service. Sa responsabilité ne saurait être engagée à
        raison d’une interruption imputable à un prestataire technique, à un cas
        de force majeure, ou du fait des relations contractuelles nouées entre
        l’abonné et ses clients. En toute hypothèse, la responsabilité de{" "}
        {EDITEUR.societe} est limitée aux sommes effectivement versées par
        l’abonné au cours des douze derniers mois.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Le traitement des données est décrit dans notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>. Pour les
        données des clients transmises via la plateforme, l’abonné agit en
        qualité de responsable de traitement pour ses propres finalités
        notariales, {EDITEUR.societe} intervenant comme sous-traitant au sens de
        l’article 28 du RGPD.
      </p>

      <h2>10. Droit applicable et litiges</h2>
      <p>
        Les présentes CGV sont soumises au droit français. À défaut de résolution
        amiable, le litige relève des juridictions compétentes de Paris, les
        parties étant toutes deux commerçantes ou professionnelles.
      </p>

      <h2>11. Contact</h2>
      <p>
        Pour toute question relative à l’abonnement ou à sa facturation :{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
      </p>
    </LegalLayout>
  );
}
