import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { EDITEUR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Connecteur MCP Notaires.io pour Claude",
  description:
    "Trouvez un notaire et prenez rendez-vous en conversant avec Claude : le connecteur Notaires.io cherche dans l'annuaire, affiche les créneaux libres et réserve le rendez-vous.",
  alternates: { canonical: "/claude" },
};

const URL_MCP = "https://notaires.io/api/mcp/mcp";

export default function ClaudeConnecteurPage() {
  return (
    <LegalLayout
      title="Notaires.io pour Claude"
      intro="Trouver un notaire et prendre rendez-vous depuis Claude, sans quitter la conversation."
      updated="26 octobre 2026"
    >
      <p>
        Le connecteur Notaires.io donne à Claude accès à l&apos;annuaire des notaires de France et à
        l&apos;agenda en ligne des notaires inscrits. Claude peut chercher un notaire par ville et par
        domaine, afficher sa fiche, lister ses créneaux libres et réserver un rendez-vous, au cabinet
        ou en visio, après votre accord.
      </p>

      <h2>1. Ajouter le connecteur</h2>
      <ol>
        <li>Dans Claude, ouvrez <strong>Paramètres → Connecteurs</strong>.</li>
        <li>
          Choisissez Notaires.io dans l&apos;annuaire, ou cliquez sur{" "}
          <strong>Ajouter un connecteur personnalisé</strong> et collez l&apos;adresse :{" "}
          <code>{URL_MCP}</code>
        </li>
        <li>Aucune connexion n&apos;est requise : pas de compte, pas de mot de passe.</li>
        <li>Dans une conversation, activez Notaires.io avec le bouton <strong>+</strong> → Connecteurs.</li>
      </ol>

      <h2>2. Exemples de demandes</h2>
      <ul>
        <li>« Trouve-moi un notaire spécialisé en succession à Lyon. »</li>
        <li>« Quels sont les créneaux de ce notaire la semaine prochaine ? »</li>
        <li>« Réserve-moi un rendez-vous en visio jeudi matin pour un achat immobilier. »</li>
        <li>« Quelles pièces apporter pour un rendez-vous de donation ? »</li>
      </ul>

      <h2>3. Outils du connecteur</h2>
      <ul>
        <li><strong>rechercher_notaires</strong> : notaires d&apos;une ville, filtrés par arrondissement, domaine, langue ou prise de rendez-vous en ligne (lecture)</li>
        <li><strong>fiche_notaire</strong> : étude, adresse, domaines, langues, présentation (lecture)</li>
        <li><strong>types_de_rendez_vous</strong> : motifs de rendez-vous, rôles et pièces à préparer (lecture)</li>
        <li><strong>creneaux_disponibles</strong> : créneaux libres de l&apos;agenda d&apos;un notaire inscrit (lecture)</li>
        <li><strong>reserver_rendez_vous</strong> : réserve un créneau après validation du récapitulatif par l&apos;utilisateur (écriture)</li>
      </ul>

      <h2>4. Comment se passe une réservation</h2>
      <p>
        Claude vous présente un récapitulatif (notaire, date, heure, modalité, motif, vos coordonnées)
        et ne réserve qu&apos;après votre accord. Vous recevez ensuite un e-mail de confirmation avec un
        lien pour gérer ou annuler le rendez-vous ; le notaire est prévenu par e-mail. Seuls les
        notaires inscrits sur Notaires.io avec un agenda en ligne peuvent être réservés ; pour les
        autres, Claude vous donne leurs coordonnées.
      </p>

      <h2>5. Données et confidentialité</h2>
      <p>
        Le connecteur ne reçoit que les informations nécessaires au rendez-vous : nom, e-mail,
        téléphone et motif. Il ne reçoit jamais de pièce d&apos;identité ni de document : les pièces se
        transmettent au notaire depuis votre espace client ou le jour du rendez-vous. Les données
        sont traitées comme décrit dans notre <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>6. Limites</h2>
      <ul>
        <li>Notaires exerçant en France uniquement.</li>
        <li>Les résultats ne constituent ni un classement ni une recommandation de notaire.</li>
        <li>Le connecteur ne donne pas de conseil juridique : posez vos questions au notaire lors du rendez-vous.</li>
      </ul>

      <h2>7. Assistance</h2>
      <p>
        Une question ou un problème avec le connecteur :{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>
      </p>
    </LegalLayout>
  );
}
