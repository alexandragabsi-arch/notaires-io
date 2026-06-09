export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // "YYYY-MM-DD"
  readingTime: number; // minutes
  category: string;
  keywords: string[];
  canonicalUrl: string;
  faqs?: { question: string; answer: string }[];
}

const BASE = "https://notaires.io";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "contrat-de-mariage-separation-de-biens-ou-communaute",
    title: "Contrat de mariage : séparation de biens ou communauté ?",
    excerpt:
      "Quel régime matrimonial choisir entre la séparation de biens et la communauté de biens ? Tour d'horizon des options avec leurs avantages, inconvénients et implications patrimoniales.",
    date: "2026-06-03",
    readingTime: 6,
    category: "Mariage",
    keywords: ["contrat de mariage séparation de biens", "régime matrimonial lequel choisir", "contrat de mariage notaire"],
    canonicalUrl: `${BASE}/blog/contrat-de-mariage-separation-de-biens-ou-communaute`,
  },
  {
    slug: "frais-de-notaire-achat-immobilier",
    title: "Frais de notaire pour un achat immobilier : tout comprendre",
    excerpt:
      "Droits de mutation, émoluments, débours… Les frais de notaire représentent 7 à 8 % du prix d'achat dans l'ancien. Découvrez leur composition et les montants exacts selon votre projet.",
    date: "2026-06-03",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["frais de notaire achat immobilier", "combien coûte un notaire immobilier", "calcul frais de notaire"],
    canonicalUrl: `${BASE}/blog/frais-de-notaire-achat-immobilier`,
  },
  {
    slug: "delai-succession-notaire",
    title: "Délai d'une succession : combien de temps ça prend ?",
    excerpt:
      "Une succession simple se règle en 6 à 12 mois, mais les dossiers complexes peuvent durer plusieurs années. Quelles sont les étapes, les délais légaux et comment les optimiser ?",
    date: "2026-06-03",
    readingTime: 6,
    category: "Succession",
    keywords: ["délai succession notaire", "combien de temps pour une succession", "étapes succession notaire"],
    canonicalUrl: `${BASE}/blog/delai-succession-notaire`,
  },
  {
    slug: "pacs-ou-mariage-difference-notaire",
    title: "PACS ou mariage : quelle différence pour le notaire ?",
    excerpt:
      "PACS et mariage ne protègent pas votre partenaire de la même façon. Succession, impôts, séparation : découvrez les différences clés et quand faire appel à un notaire.",
    date: "2026-06-03",
    readingTime: 5,
    category: "Famille",
    keywords: ["PACS ou mariage différence", "notaire PACS mariage", "protection conjoint PACS mariage"],
    canonicalUrl: `${BASE}/blog/pacs-ou-mariage-difference-notaire`,
  },
  {
    slug: "premier-rendez-vous-notaire-gratuit",
    title: "1er rendez-vous notaire gratuit : comment ça marche chez Notaires.io ?",
    excerpt:
      "Chez Notaires.io, le premier rendez-vous avec un notaire est offert. Découvrez comment fonctionne cette consultation de 30 minutes, ce qu'on peut aborder et comment se préparer.",
    date: "2026-06-03",
    readingTime: 4,
    category: "Guide",
    keywords: ["premier rendez-vous notaire gratuit", "rdv notaire gratuit visio", "consultation notaire gratuite"],
    canonicalUrl: `${BASE}/blog/premier-rendez-vous-notaire-gratuit`,
  },
  {
    slug: "donation-enfants-avant-deces",
    title: "Donation à ses enfants : comment transmettre son patrimoine de son vivant ?",
    excerpt:
      "Donner de son vivant permet de réduire les droits de succession grâce aux abattements fiscaux. Donation simple, donation-partage, nue-propriété : les stratégies expliquées par un notaire.",
    date: "2026-06-03",
    readingTime: 5,
    category: "Donation",
    keywords: ["donation enfants notaire", "transmettre patrimoine vivant", "abattement donation enfants"],
    canonicalUrl: `${BASE}/blog/donation-enfants-avant-deces`,
  },
  {
    slug: "testament-olographe-notarie",
    title: "Testament olographe ou notarié : lequel choisir ?",
    excerpt: "Testament olographe ou notarié : découvrez les différences, avantages et inconvénients pour choisir la forme adaptée à votre succession.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["testament olographe ou notarié", "testament notaire", "rédiger testament", "succession"],
    canonicalUrl: `${BASE}/blog/testament-olographe-notarie`,
    faqs: [
    { question: "Un testament olographe a-t-il la même valeur qu'un testament notarié ?", answer: "Oui, les deux ont la même valeur juridique s'ils respectent les conditions de forme. Le testament notarié offre toutefois une sécurité juridique supérieure et un risque de contestation moindre." },
    { question: "Combien coûte un testament chez le notaire ?", answer: "Un testament authentique coûte environ 115 à 140 € HT, auxquels s'ajoutent les frais d'enregistrement au fichier central des dispositions de dernières volontés (environ 30 €)." },
    { question: "Peut-on modifier un testament olographe ou notarié ?", answer: "Oui, vous pouvez à tout moment révoquer ou modifier votre testament, qu'il soit olographe ou notarié, en rédigeant un nouveau document daté et signé." },
  ],
  },
  {
    slug: "assurance-vie-succession-notaire",
    title: "Assurance vie et succession : rôle du notaire",
    excerpt: "Assurance vie succession notaire : découvrez quand le notaire intervient, la fiscalité applicable et comment optimiser la transmission à vos bénéficiaires.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["assurance vie succession notaire", "fiscalité assurance vie", "bénéficiaire assurance vie", "transmission patrimoine"],
    canonicalUrl: `${BASE}/blog/assurance-vie-succession-notaire`,
    faqs: [
    { question: "Faut-il déclarer l'assurance vie au notaire ?", answer: "Oui, même si elle est hors succession civile, le notaire doit en être informé pour vérifier l'absence de primes manifestement exagérées et calculer la fiscalité éventuelle." },
    { question: "L'assurance vie échappe-t-elle aux droits de succession ?", answer: "Partiellement. Les versements avant 70 ans bénéficient d'un abattement de 152 500 € par bénéficiaire, puis taxation à 20% ou 31,25%. Après 70 ans, abattement global de 30 500 €." },
    { question: "Le notaire peut-il débloquer une assurance vie ?", answer: "Non, c'est la compagnie d'assurance qui verse les fonds directement aux bénéficiaires désignés, sur présentation de l'acte de décès et des pièces justificatives." },
  ],
  },
  {
    slug: "heritiers-reservataires-quotite",
    title: "Héritiers réservataires et quotité disponible : le guide",
    excerpt: "Héritiers réservataires et quotité disponible : comprenez la part réservée par la loi et celle que vous pouvez transmettre librement par testament.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["héritiers réservataires", "quotité disponible", "réserve héréditaire", "succession", "testament"],
    canonicalUrl: `${BASE}/blog/heritiers-reservataires-quotite`,
    faqs: [
    { question: "Qui sont les héritiers réservataires ?", answer: "Les enfants du défunt (et leurs descendants par représentation) sont toujours réservataires. À défaut de descendants, le conjoint survivant devient réservataire à hauteur d'un quart." },
    { question: "Peut-on déshériter un enfant en France ?", answer: "Non, la loi française interdit de déshériter totalement un enfant. La réserve héréditaire lui garantit une part minimale de la succession, quelle que soit la volonté du défunt." },
    { question: "Comment calculer la quotité disponible ?", answer: "Elle dépend du nombre d'enfants : 1/2 avec un enfant, 1/3 avec deux enfants, 1/4 avec trois enfants ou plus. Le reste constitue la réserve héréditaire." },
  ],
  },
  {
    slug: "declaration-succession-delais",
    title: "Déclaration de succession : délais et impôts à connaître",
    excerpt: "Déclaration de succession : délais légaux, impôts à payer, pénalités de retard et démarches. Le guide complet pour éviter les sanctions fiscales.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["déclaration succession délais", "impôts succession", "droits de succession", "délai déclaration succession", "pénalités succession"],
    canonicalUrl: `${BASE}/blog/declaration-succession-delais`,
    faqs: [
    { question: "Quel est le délai pour déclarer une succession ?", answer: "Le délai est de 6 mois à compter du décès si celui-ci a lieu en France, et de 12 mois s'il survient à l'étranger. Passé ce délai, des pénalités s'appliquent." },
    { question: "Qui doit payer les droits de succession ?", answer: "Chaque héritier paie les droits sur sa part. Le notaire calcule le montant en fonction du lien de parenté et des abattements applicables (100 000 € entre parent et enfant)." },
    { question: "Que se passe-t-il en cas de retard de déclaration ?", answer: "Un intérêt de retard de 0,20 % par mois s'applique dès le 7ème mois, plus une majoration de 10 % après 6 mois supplémentaires, et 40 % après mise en demeure." },
  ],
  },
  {
    slug: "succession-sans-testament",
    title: "Succession sans testament : qui hérite et comment ?",
    excerpt: "Succession sans testament : découvrez l'ordre des héritiers, les parts légales et le rôle du notaire pour régler une succession ab intestat en France.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["succession sans testament", "héritiers légaux", "succession ab intestat", "ordre des héritiers", "part réservataire"],
    canonicalUrl: `${BASE}/blog/succession-sans-testament`,
    faqs: [
    { question: "Que se passe-t-il en cas de succession sans testament ?", answer: "La loi française détermine automatiquement les héritiers selon un ordre précis : descendants, ascendants, collatéraux. Le notaire applique les règles du Code civil pour répartir le patrimoine." },
    { question: "Le conjoint survivant hérite-t-il sans testament ?", answer: "Oui. En présence d'enfants communs, il choisit entre 1/4 en pleine propriété ou la totalité en usufruit. Sans enfants, sa part est plus importante selon les autres héritiers présents." },
    { question: "Combien de temps pour régler une succession sans testament ?", answer: "En moyenne 6 mois pour la déclaration fiscale, et 6 à 12 mois pour le règlement complet. Les délais varient selon la complexité du patrimoine et le nombre d'héritiers." },
  ],
  },
  {
    slug: "desheriter-enfant-possible",
    title: "Peut-on déshériter un enfant en France ? Règles 2025",
    excerpt: "Peut-on déshériter un enfant en France ? Découvrez la réserve héréditaire, les exceptions et les solutions légales pour organiser votre succession.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["déshériter un enfant", "réserve héréditaire", "succession", "héritiers réservataires", "quotité disponible"],
    canonicalUrl: `${BASE}/blog/desheriter-enfant-possible`,
    faqs: [
    { question: "Peut-on totalement déshériter un enfant en France ?", answer: "Non, le droit français interdit de déshériter totalement un enfant grâce à la réserve héréditaire qui lui garantit une part minimale du patrimoine." },
    { question: "Dans quels cas un enfant peut-il être privé d'héritage ?", answer: "Un enfant peut être déclaré indigne en cas de faute grave (meurtre, violences, faux témoignage) envers le défunt, sur décision judiciaire." },
    { question: "Comment réduire la part d'un enfant légalement ?", answer: "Vous pouvez avantager d'autres héritiers via la quotité disponible, l'assurance-vie ou des donations, tout en respectant la réserve héréditaire." },
  ],
  },
  {
    slug: "droits-succession-calcul",
    title: "Droits de succession 2026 : calcul et barème actualisé",
    excerpt: "Droits de succession calcul barème 2026 : découvrez les tranches, abattements et méthodes pour estimer précisément ce que vous devrez payer au fisc.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["droits de succession calcul", "barème succession 2026", "abattement succession", "calcul droits succession", "fiscalité héritage"],
    canonicalUrl: `${BASE}/blog/droits-succession-calcul`,
    faqs: [
    { question: "Quel est l'abattement entre parent et enfant en 2026 ?", answer: "L'abattement reste fixé à 100 000 € par parent et par enfant, renouvelable tous les 15 ans." },
    { question: "Le conjoint survivant paie-t-il des droits de succession ?", answer: "Non, le conjoint marié ou pacsé est totalement exonéré de droits de succession depuis la loi TEPA de 2007." },
    { question: "Quand faut-il payer les droits de succession ?", answer: "Les droits doivent être réglés dans les 6 mois suivant le décès (12 mois si décès à l'étranger), en même temps que la déclaration." },
  ],
  },
  {
    slug: "acte-notoriete-succession",
    title: "Acte de notoriété succession : rôle du notaire",
    excerpt: "Acte de notoriété succession notaire : définition, prix, délais et démarches. Découvrez son utilité pour prouver votre qualité d'héritier.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["acte de notoriété succession", "notaire succession", "héritier", "preuve qualité héritier", "règlement succession"],
    canonicalUrl: `${BASE}/blog/acte-notoriete-succession`,
    faqs: [
    { question: "Quel est le prix d'un acte de notoriété ?", answer: "Le tarif est réglementé : environ 58 € HT pour l'émolument du notaire, auxquels s'ajoutent les frais de recherche, copies et débours. Comptez en pratique entre 200 € et 400 € TTC selon la complexité du dossier." },
    { question: "L'acte de notoriété est-il obligatoire ?", answer: "Il est obligatoire pour toute succession dépassant 5 910,57 € à débloquer auprès des banques, ou comportant un bien immobilier. En dessous, un certificat d'hérédité ou une attestation signée des héritiers peut suffire." },
    { question: "Combien de temps pour obtenir l'acte de notoriété ?", answer: "Le délai est généralement de 1 à 3 mois après le décès. Il dépend de la rapidité à réunir les pièces d'état civil, du livret de famille et de l'identification de tous les héritiers." },
  ],
  },
  {
    slug: "partage-succession-indivision",
    title: "Partage succession indivision notaire : guide complet",
    excerpt: "Partage succession indivision notaire : étapes, coûts et solutions en cas de blocage. Conseils d'experts pour sortir sereinement de l'indivision.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["partage succession indivision notaire", "sortir indivision succession", "acte de partage notaire", "indivision successorale", "partage amiable héritiers"],
    canonicalUrl: `${BASE}/blog/partage-succession-indivision`,
    faqs: [
    { question: "Le recours au notaire est-il obligatoire pour un partage de succession ?", answer: "Oui, dès lors que la succession comprend un bien immobilier. Le notaire rédige l'acte de partage authentique nécessaire à la publication au service de la publicité foncière." },
    { question: "Combien coûte un partage successoral chez le notaire ?", answer: "Les frais comprennent un droit de partage de 2,5% sur l'actif net partagé, les émoluments du notaire (environ 1 à 2%) et les débours. Comptez globalement entre 4 et 5% de la valeur des biens." },
    { question: "Que faire si un héritier refuse le partage ?", answer: "Vous pouvez saisir le tribunal judiciaire pour demander un partage judiciaire. Le juge désignera un notaire pour procéder aux opérations et trancher les désaccords entre cohéritiers." },
  ],
  },
  {
    slug: "renoncer-succession-notaire",
    title: "Renoncer à une succession : procédure notaire 2025",
    excerpt: "Renoncer à une succession chez le notaire : procédure, délais, coût et conséquences. Guide complet pour protéger votre patrimoine en cas de dettes.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["renoncer succession notaire", "renonciation succession procédure", "refuser héritage notaire", "succession déficitaire"],
    canonicalUrl: `${BASE}/blog/renoncer-succession-notaire`,
    faqs: [
    { question: "Combien coûte une renonciation à succession chez le notaire ?", answer: "La déclaration de renonciation au greffe est gratuite. Chez le notaire, comptez environ 15 à 30 € pour l'acte authentique, hors honoraires de conseil éventuels." },
    { question: "Quel est le délai pour renoncer à une succession ?", answer: "Vous disposez de 10 ans à compter de l'ouverture de la succession. Toutefois, un créancier ou cohéritier peut vous sommer de choisir après 4 mois, vous laissant alors 2 mois pour vous décider." },
    { question: "Peut-on revenir sur une renonciation à succession ?", answer: "Oui, tant que la succession n'a pas été acceptée par un autre héritier et dans la limite de 10 ans. Cette rétractation s'appelle la révocation de la renonciation." },
  ],
  },
  {
    slug: "succession-concubin-non-marie",
    title: "Succession concubin non marié : guide notaire 2025",
    excerpt: "Succession concubin non marié : droits, fiscalité à 60%, solutions notariales pour protéger votre partenaire. Conseils d'un notaire expert.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["succession concubin non marié", "héritage concubinage", "protéger concubin", "donation concubin", "testament concubin"],
    canonicalUrl: `${BASE}/blog/succession-concubin-non-marie`,
    faqs: [
    { question: "Un concubin hérite-t-il automatiquement ?", answer: "Non, le concubin n'a aucun droit successoral légal. Sans testament ni donation, il ne reçoit rien du patrimoine de son partenaire décédé." },
    { question: "Quels sont les droits de succession pour un concubin ?", answer: "Le concubin est taxé à 60% après un abattement très faible de 1 594 €, ce qui en fait le régime fiscal le plus défavorable." },
    { question: "Comment protéger son concubin sans se marier ?", answer: "Plusieurs outils existent : testament, assurance-vie, SCI, donation, ou conclusion d'un PACS qui offre une fiscalité bien plus avantageuse." },
  ],
  },
  {
    slug: "optimisation-fiscale-succession",
    title: "Optimisation fiscale succession : guide notaire 2025",
    excerpt: "Optimisation fiscale succession notaire : découvrez les stratégies légales pour réduire les droits de succession et protéger votre patrimoine familial.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["optimisation fiscale succession", "droits de succession", "notaire succession", "donation", "assurance-vie"],
    canonicalUrl: `${BASE}/blog/optimisation-fiscale-succession`,
    faqs: [
    { question: "Quel est l'abattement pour les enfants en 2025 ?", answer: "Chaque enfant bénéficie d'un abattement de 100 000 € par parent, renouvelable tous les 15 ans sur les donations." },
    { question: "L'assurance-vie est-elle vraiment hors succession ?", answer: "Oui, les capitaux versés avant 70 ans bénéficient d'un abattement de 152 500 € par bénéficiaire, hors actif successoral." },
    { question: "Quand consulter un notaire pour optimiser sa succession ?", answer: "Le plus tôt possible. Une planification anticipée permet d'étaler les donations et de maximiser les abattements fiscaux." },
  ],
  },
  {
    slug: "rapport-donation-succession",
    title: "Rapport des donations à la succession : règles 2025",
    excerpt: "Le rapport des donations à la succession garantit l'égalité entre héritiers. Découvrez les règles, calculs et exceptions à connaître.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["rapport donation succession", "rapport civil succession", "donation rapportable", "égalité héritiers"],
    canonicalUrl: `${BASE}/blog/rapport-donation-succession`,
    faqs: [
    { question: "Toutes les donations sont-elles rapportables ?", answer: "Non. Seules les donations consenties à un héritier sont rapportables, sauf si elles ont été faites hors part successorale. Les présents d'usage en sont également exclus." },
    { question: "Comment évaluer un bien donné lors du rapport ?", answer: "Le bien est évalué à sa valeur au jour du partage, selon son état au jour de la donation. Cette règle protège l'équité entre cohéritiers." },
    { question: "Que se passe-t-il si la donation excède la part de l'héritier ?", answer: "Si le rapport révèle un excédent, l'héritier doit une indemnité de rapport à la succession, sauf disposition contraire de l'acte de donation." },
  ],
  },
  {
    slug: "legs-testament-notaire",
    title: "Legs particulier ou universel : guide testament notaire",
    excerpt: "Legs particulier, universel ou à titre universel dans un testament chez le notaire : différences, fiscalité et conseils pratiques pour bien transmettre.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["legs particulier", "legs universel", "testament notaire", "legs à titre universel", "succession"],
    canonicalUrl: `${BASE}/blog/legs-testament-notaire`,
    faqs: [
    { question: "Quelle est la différence entre legs particulier et universel ?", answer: "Le legs universel transmet l'ensemble du patrimoine, le legs particulier porte sur un bien précis (somme, immeuble, objet). Le legs à titre universel concerne une quote-part du patrimoine." },
    { question: "Faut-il obligatoirement passer par un notaire pour un legs ?", answer: "Non, un testament olographe (écrit à la main) suffit légalement. Mais le testament authentique chez le notaire sécurise vos volontés et évite les contestations." },
    { question: "Quels sont les frais fiscaux d'un legs ?", answer: "Les droits de succession s'appliquent selon le lien de parenté entre testateur et légataire. Un legs à un tiers est taxé à 60 %, tandis qu'un legs à un enfant bénéficie d'abattements." },
  ],
  },
  {
    slug: "succession-internationale",
    title: "Succession internationale : rôle du notaire français",
    excerpt: "Succession internationale et notaire français : règlement européen, loi applicable, fiscalité et démarches expliqués clairement par nos experts.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["succession internationale notaire français", "succession transfrontalière", "règlement européen succession", "certificat successoral européen"],
    canonicalUrl: `${BASE}/blog/succession-internationale`,
    faqs: [
    { question: "Quelle loi s'applique à une succession internationale ?", answer: "Depuis le règlement européen de 2015, la loi applicable est celle du dernier domicile du défunt, sauf choix exprès pour la loi de sa nationalité dans son testament." },
    { question: "Faut-il payer des droits de succession dans deux pays ?", answer: "Cela dépend des conventions fiscales bilatérales. La France a signé des conventions avec une trentaine de pays pour éviter la double imposition successorale." },
    { question: "Qu'est-ce que le certificat successoral européen ?", answer: "C'est un document délivré par le notaire qui prouve la qualité d'héritier dans tous les pays de l'Union européenne, sans formalité supplémentaire." },
  ],
  },
  {
    slug: "compromis-acte-de-vente-difference",
    title: "Compromis vs acte de vente notaire : quelles différences ?",
    excerpt: "Compromis vs acte de vente notaire : découvrez les différences clés, délais, engagements et rôle du notaire pour sécuriser votre achat immobilier.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["compromis vs acte de vente notaire", "compromis de vente", "acte authentique", "achat immobilier notaire"],
    canonicalUrl: `${BASE}/blog/compromis-acte-de-vente-difference`,
    faqs: [
    { question: "Le compromis de vente doit-il être signé chez le notaire ?", answer: "Non, le compromis peut être signé chez un agent immobilier ou entre particuliers. Toutefois, le faire signer chez un notaire offre une sécurité juridique renforcée, sans surcoût dans la plupart des cas." },
    { question: "Combien de temps entre le compromis et l'acte de vente ?", answer: "Le délai habituel est de 3 à 4 mois. Ce temps permet de lever les conditions suspensives (prêt, urbanisme) et de réunir tous les documents nécessaires à la signature de l'acte authentique." },
    { question: "Peut-on annuler un compromis de vente ?", answer: "L'acheteur dispose d'un délai de rétractation de 10 jours après la signature. Au-delà, l'annulation n'est possible que si une condition suspensive n'est pas remplie, sous peine de perdre le dépôt de garantie." },
  ],
  },
  {
    slug: "plus-value-immobiliere-exoneration",
    title: "Plus-value immobilière : exonération résidence principale",
    excerpt: "Plus-value immobilière et exonération résidence principale : conditions, calcul, abattements et pièges à éviter pour vendre sans impôt en 2024.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["plus-value immobilière exonération résidence principale", "exonération plus-value", "vente résidence principale", "impôt plus-value immobilière"],
    canonicalUrl: `${BASE}/blog/plus-value-immobiliere-exoneration`,
    faqs: [
    { question: "Quelle est l'exonération de plus-value pour une résidence principale ?", answer: "La vente de votre résidence principale est totalement exonérée de plus-value immobilière, sans condition de durée de détention, à condition qu'elle constitue votre habitation effective et habituelle au jour de la cession." },
    { question: "Combien de temps pour vendre après avoir quitté sa résidence principale ?", answer: "L'administration fiscale tolère un délai d'environ 12 mois entre le déménagement et la vente, à condition que le bien soit mis en vente immédiatement et reste inoccupé." },
    { question: "Une résidence secondaire peut-elle bénéficier d'une exonération ?", answer: "Oui, dans certains cas : première cession d'une résidence secondaire si le vendeur n'a pas été propriétaire de sa résidence principale depuis 4 ans et réinvestit dans une résidence principale dans les 24 mois." },
  ],
  },
  {
    slug: "viager-notaire-guide",
    title: "Viager, bouquet et rente : le guide notaire complet",
    excerpt: "Viager bouquet rente notaire : comprenez le calcul, la fiscalité et les étapes clés pour vendre ou acheter en viager en toute sécurité.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["viager bouquet rente notaire", "vente en viager", "calcul rente viagère", "viager occupé"],
    canonicalUrl: `${BASE}/blog/viager-notaire-guide`,
    faqs: [
    { question: "Quelle est la différence entre bouquet et rente ?", answer: "Le bouquet est la somme versée au comptant le jour de la signature. La rente est le versement périodique (souvent mensuel) dû au vendeur jusqu'à son décès." },
    { question: "Le passage chez le notaire est-il obligatoire ?", answer: "Oui. La vente en viager est un acte authentique obligatoire. Le notaire sécurise la transaction, calcule la rente et publie l'acte au service de la publicité foncière." },
    { question: "Que se passe-t-il si l'acheteur ne paie plus la rente ?", answer: "Le contrat prévoit une clause résolutoire : le vendeur peut récupérer le bien et conserver les sommes déjà versées à titre de dommages-intérêts." },
  ],
  },
  {
    slug: "sci-familiale-creation-notaire",
    title: "SCI familiale : création chez le notaire et avantages",
    excerpt: "SCI familiale : création chez le notaire, avantages fiscaux, transmission patrimoniale et étapes clés. Guide complet pour bien démarrer votre projet.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["SCI familiale", "création SCI notaire", "société civile immobilière", "transmission patrimoine", "avantages SCI"],
    canonicalUrl: `${BASE}/blog/sci-familiale-creation-notaire`,
    faqs: [
    { question: "Faut-il obligatoirement un notaire pour créer une SCI familiale ?", answer: "Le notaire n'est pas obligatoire si la SCI ne reçoit aucun apport immobilier. En revanche, dès qu'un bien immobilier est apporté au capital, l'acte notarié devient impératif." },
    { question: "Quel est le coût de création d'une SCI familiale ?", answer: "Comptez entre 1 500 € et 3 000 € avec un notaire, incluant la rédaction des statuts, les frais d'enregistrement et la publication légale. Le coût varie selon les apports." },
    { question: "Combien d'associés faut-il pour créer une SCI familiale ?", answer: "Une SCI requiert au minimum deux associés, souvent des membres d'une même famille (parents, enfants, conjoints). Aucun capital minimum n'est imposé par la loi." },
  ],
  },
  {
    slug: "achat-immobilier-indivision",
    title: "Achat immobilier en indivision : le rôle du notaire",
    excerpt: "Achat immobilier en indivision notaire : règles, quote-parts, convention et conseils pour sécuriser votre acquisition à plusieurs en toute sérénité.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["achat immobilier en indivision notaire", "indivision immobilière", "convention indivision", "quote-part indivision"],
    canonicalUrl: `${BASE}/blog/achat-immobilier-indivision`,
    faqs: [
    { question: "Faut-il obligatoirement passer par un notaire pour acheter en indivision ?", answer: "Oui, tout achat immobilier nécessite un acte authentique rédigé par un notaire, qu'il s'agisse d'un achat seul ou en indivision." },
    { question: "Peut-on fixer des quotes-parts différentes des apports ?", answer: "Oui, mais cela peut être requalifié en donation déguisée par l'administration fiscale. Le notaire vous conseillera la répartition la plus adaptée." },
    { question: "Que se passe-t-il si un indivisaire veut vendre sa part ?", answer: "Chaque indivisaire peut céder sa quote-part, mais les autres bénéficient d'un droit de préemption. À défaut d'accord, le partage judiciaire peut être demandé." },
  ],
  },
  {
    slug: "servitude-passage-notaire",
    title: "Servitude de passage : rôle du notaire et démarches",
    excerpt: "Servitude de passage et notaire : découvrez comment l'établir, la modifier ou la contester. Conseils pratiques et démarches détaillées.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["servitude de passage notaire", "acte de servitude", "droit de passage", "enclavement", "servitude conventionnelle"],
    canonicalUrl: `${BASE}/blog/servitude-passage-notaire`,
    faqs: [
    { question: "Faut-il obligatoirement un notaire pour une servitude de passage ?", answer: "Oui, dès lors que la servitude est conventionnelle et destinée à être publiée au service de la publicité foncière, l'acte notarié est obligatoire pour la rendre opposable aux tiers." },
    { question: "Combien coûte la création d'une servitude de passage chez le notaire ?", answer: "Les frais varient généralement entre 800 et 2 000 €, incluant les émoluments du notaire, les droits d'enregistrement et les frais de publication foncière." },
    { question: "Une servitude de passage peut-elle être supprimée ?", answer: "Oui, par accord amiable entre les propriétaires via un acte notarié, par non-usage pendant 30 ans, ou si l'état d'enclavement cesse." },
  ],
  },
  {
    slug: "promesse-vente-unilaterale",
    title: "Promesse de vente unilatérale chez le notaire : guide complet",
    excerpt: "La promesse de vente unilatérale notaire engage le vendeur seul. Découvrez son fonctionnement, ses coûts et son intérêt pour sécuriser votre achat immobilier.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["promesse de vente unilatérale notaire", "promesse unilatérale de vente", "indemnité d'immobilisation", "avant-contrat immobilier"],
    canonicalUrl: `${BASE}/blog/promesse-vente-unilaterale`,
  faqs: [
    { question: "Quelle est la différence entre promesse unilatérale et compromis de vente ?", answer: "La promesse unilatérale engage uniquement le vendeur qui réserve son bien à l'acheteur. Le compromis engage les deux parties à conclure la vente." },
    { question: "Combien coûte une promesse unilatérale de vente chez le notaire ?", answer: "Comptez entre 250 et 500 € de frais de rédaction et d'enregistrement, à la charge de l'acquéreur sauf accord contraire." },
    { question: "L'indemnité d'immobilisation est-elle remboursable ?", answer: "Oui, si l'acquéreur renonce dans le délai de rétractation de 10 jours ou si une condition suspensive (prêt refusé) ne se réalise pas." },
  ],
  },
  {
    slug: "frais-notaire-neuf-vefa",
    title: "Frais de notaire achat neuf VEFA : guide complet 2025",
    excerpt: "Frais de notaire achat neuf VEFA : taux réduits 2-3%, calcul détaillé, exemples chiffrés et conseils pour optimiser votre acquisition immobilière.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["frais de notaire achat neuf VEFA", "frais notaire VEFA", "achat immobilier neuf", "frais réduits notaire"],
    canonicalUrl: `${BASE}/blog/frais-notaire-neuf-vefa`,
  faqs: [
    { question: "Quel est le taux des frais de notaire pour un achat en VEFA ?", answer: "Les frais de notaire pour un achat neuf en VEFA représentent environ 2 à 3% du prix d&apos;achat, contre 7 à 8% dans l&apos;ancien, grâce à des droits d&apos;enregistrement réduits." },
    { question: "Quand paie-t-on les frais de notaire en VEFA ?", answer: "Les frais de notaire sont réglés intégralement le jour de la signature de l&apos;acte authentique chez le notaire, soit au moment de l&apos;acquisition du terrain et des fondations." },
    { question: "Les frais de notaire VEFA incluent-ils la TVA ?", answer: "Non, la TVA à 20% est incluse dans le prix de vente du bien neuf, mais elle n&apos;entre pas dans l&apos;assiette de calcul des frais de notaire en VEFA." },
  ],
  },
  {
    slug: "droit-preemption-mairie-notaire",
    title: "Droit de préemption mairie : rôle du notaire",
    excerpt: "Droit de préemption mairie notaire : comment ça fonctionne, délais, obligations du vendeur et recours possibles pour réussir votre vente immobilière.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["droit de préemption mairie notaire", "droit de préemption urbain", "DPU vente immobilier", "préemption commune"],
    canonicalUrl: `${BASE}/blog/droit-preemption-mairie-notaire`,
    faqs: [
      { question: "La mairie peut-elle toujours exercer son droit de préemption ?", answer: "Non, la commune ne peut exercer son droit de préemption urbain que dans les zones définies par le PLU. Hors zone DPU, les transactions sont libres de toute préemption communale." },
      { question: "Quel est le délai de réponse de la mairie après la DIA ?", answer: "La commune dispose de 2 mois à compter de la réception de la déclaration d'intention d'aliéner pour exercer ou renoncer à son droit de préemption. Sans réponse dans ce délai, la vente peut se poursuivre normalement." },
      { question: "Peut-on contester une décision de préemption ?", answer: "Oui, via un recours pour excès de pouvoir devant le tribunal administratif dans les 2 mois suivant la notification. Le notaire peut vous orienter vers un avocat spécialisé en droit public." },
    ],
  },
  {
    slug: "mainlevee-hypotheque-notaire",
    title: "Main levée d'hypothèque : coût et rôle du notaire",
    excerpt: "Main levée hypothèque notaire coût : procédure, délais, tarifs et alternatives. Tout ce qu'il faut savoir pour libérer votre bien immobilier après remboursement.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["main levée hypothèque notaire coût", "mainlevée hypothèque", "radiation hypothèque", "frais mainlevée"],
    canonicalUrl: `${BASE}/blog/mainlevee-hypotheque-notaire`,
    faqs: [
      { question: "La main levée est-elle automatique après remboursement du prêt ?", answer: "Non. En France, l'hypothèque s'éteint automatiquement 1 an après la dernière échéance du prêt, mais pour vendre le bien avant ce délai, une main levée anticipée formelle est indispensable." },
      { question: "Combien coûte une main levée d'hypothèque chez le notaire ?", answer: "Les frais comprennent les émoluments du notaire (entre 0,5 % et 1 % du capital garanti), la taxe de publicité foncière (0,05 %) et les débours. Comptez globalement entre 0,7 % et 1,5 % du montant initial." },
      { question: "Combien de temps prend une main levée d'hypothèque ?", answer: "La procédure dure en moyenne 2 à 4 semaines une fois les documents réunis, en l'absence de contentieux avec l'établissement prêteur." },
    ],
  },
  {
    slug: "cession-parts-sci-notaire",
    title: "Cession de parts de SCI : procédure et rôle du notaire",
    excerpt: "Cession parts SCI notaire procédure : étapes, fiscalité, agrément et formalités. Guide complet pour céder vos parts de société civile immobilière en toute sécurité.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["cession parts SCI notaire procédure", "cession parts SCI", "vente parts SCI", "fiscalité cession SCI"],
    canonicalUrl: `${BASE}/blog/cession-parts-sci-notaire`,
    faqs: [
      { question: "La cession de parts de SCI doit-elle obligatoirement passer par un notaire ?", answer: "Non, la cession de parts sociales peut se faire sous seing privé. Cependant, dès lors que la SCI détient des biens immobiliers, un acte notarié est fortement recommandé pour sécuriser la transaction et mettre à jour la publicité foncière." },
      { question: "Quelle est la fiscalité d'une cession de parts de SCI ?", answer: "La plus-value réalisée est imposable selon le régime des plus-values sur valeurs mobilières pour une SCI à l'IS, ou des plus-values immobilières pour une SCI à l'IR, avec les abattements pour durée de détention correspondants." },
      { question: "Qu'est-ce que la clause d'agrément dans une SCI ?", answer: "La clause d'agrément, présente dans la majorité des statuts, oblige le cédant à soumettre le projet de cession à l'accord préalable des autres associés. Sans leur accord, la cession ne peut avoir lieu." },
    ],
  },
  {
    slug: "dissolution-sci-notaire",
    title: "Dissolution de SCI : procédure et rôle du notaire",
    excerpt: "Dissolution SCI notaire procédure : étapes, coût, liquidation et partage des actifs. Tout comprendre pour dissoudre votre société civile immobilière sereinement.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["dissolution SCI notaire procédure", "dissoudre une SCI", "liquidation SCI", "fermer SCI notaire"],
    canonicalUrl: `${BASE}/blog/dissolution-sci-notaire`,
    faqs: [
      { question: "La dissolution d'une SCI nécessite-t-elle un notaire ?", answer: "Pas nécessairement pour la dissolution en elle-même, mais si la liquidation implique le partage ou la cession d'un bien immobilier, l'acte notarié est obligatoire pour l'opposabilité aux tiers." },
      { question: "Combien coûte la dissolution d'une SCI ?", answer: "Les frais comprennent les formalités légales (publication, greffe) pour environ 300 à 500 €, auxquels s'ajoutent les honoraires du notaire si un acte est requis et le droit de partage de 2,5 % sur l'actif net partagé." },
      { question: "Quel est le délai pour dissoudre une SCI ?", answer: "La procédure dure généralement 3 à 6 mois entre la décision de dissolution, la liquidation, le partage des actifs et les formalités de radiation au greffe du tribunal de commerce." },
    ],
  },
  {
    slug: "achat-terrain-constructible",
    title: "Achat terrain constructible : le guide notaire complet",
    excerpt: "Achat terrain constructible notaire : vérifications PLU, servitudes, raccordements et formalités. Tous les points essentiels pour sécuriser votre acquisition foncière.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["achat terrain constructible notaire", "terrain à bâtir notaire", "PLU constructibilité", "achat foncier"],
    canonicalUrl: `${BASE}/blog/achat-terrain-constructible`,
    faqs: [
      { question: "Comment vérifier qu'un terrain est bien constructible ?", answer: "Il faut consulter le Plan Local d'Urbanisme (PLU) de la commune et demander un certificat d'urbanisme opérationnel (CUb) en mairie, que le notaire peut vous aider à interpréter avant la signature du compromis." },
      { question: "Le notaire est-il obligatoire pour acheter un terrain ?", answer: "Oui, dès lors qu'un terrain est acquis par une personne physique ou morale à des fins immobilières, la vente doit être constatée par un acte authentique rédigé par un notaire." },
      { question: "Quels sont les frais de notaire pour un terrain constructible ?", answer: "Identiques à un bien ancien : entre 7 et 8 % du prix d'achat, incluant les droits de mutation (5,80 %), les émoluments et les débours." },
    ],
  },
  {
    slug: "vefa-garanties-acheteur",
    title: "VEFA : toutes les garanties pour l'acheteur expliquées",
    excerpt: "VEFA garanties acheteur notaire : GFA, parfait achèvement, biennale, décennale. Comprendre vos droits et protections lors d'un achat sur plan en France.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["VEFA garanties acheteur notaire", "garanties VEFA", "achat sur plan garanties", "GFA construction"],
    canonicalUrl: `${BASE}/blog/vefa-garanties-acheteur`,
    faqs: [
      { question: "Qu'est-ce que la garantie financière d'achèvement en VEFA ?", answer: "La GFA garantit que le programme sera achevé même si le promoteur fait faillite, grâce à l'intervention d'un établissement financier garant. Elle est obligatoire pour tout programme VEFA depuis 1990." },
      { question: "Peut-on émettre des réserves lors de la livraison en VEFA ?", answer: "Oui, et c'est fortement recommandé. À la livraison, vous pouvez consigner par écrit tous les défauts constatés. Le promoteur dispose ensuite d'1 an pour les corriger dans le cadre de la garantie de parfait achèvement." },
      { question: "Le notaire vérifie-t-il les garanties VEFA avant la signature ?", answer: "Oui, le notaire s'assure que tous les documents obligatoires sont annexés à l'acte : attestation de la GFA, assurance dommages-ouvrage du promoteur, descriptif technique détaillé et plan de masse." },
    ],
  },
  {
    slug: "donation-bien-immobilier",
    title: "Donation d'un bien immobilier : guide notaire complet",
    excerpt: "Donation d'un bien immobilier notaire : fiscalité, abattements, donation-partage et nue-propriété. Transmettre votre patrimoine immobilier de son vivant en optimisant les droits.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["donation d'un bien immobilier notaire", "donation immobilière", "donation nue-propriété", "abattement donation immobilier"],
    canonicalUrl: `${BASE}/blog/donation-bien-immobilier`,
    faqs: [
      { question: "Faut-il obligatoirement un notaire pour donner un bien immobilier ?", answer: "Oui, la donation d'un bien immobilier est un acte authentique qui doit obligatoirement être rédigé par un notaire. La donation verbale ou sous seing privé est nulle en matière immobilière." },
      { question: "Quels sont les droits de donation sur un bien immobilier entre parent et enfant ?", answer: "L'abattement est de 100 000 € par parent et par enfant, renouvelable tous les 15 ans. Au-delà, le barème progressif s'applique de 5 % à 45 % selon la valeur transmise." },
      { question: "Qu'est-ce que la donation en nue-propriété ?", answer: "Vous donnez la propriété du bien mais conservez l'usufruit (droit d'habiter ou de percevoir les loyers). La base taxable est réduite selon votre âge, ce qui diminue considérablement les droits à payer." },
    ],
  },
  {
    slug: "bail-notarie-avantages",
    title: "Bail notarié : avantages pour le locataire et le propriétaire",
    excerpt: "Bail notarié avantages locataire propriétaire : force exécutoire, sécurité juridique et économies sur les litiges. Pourquoi choisir un bail authentique en 2026.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["bail notarié avantages locataire propriétaire", "bail authentique", "bail notarié force exécutoire", "contrat location notaire"],
    canonicalUrl: `${BASE}/blog/bail-notarie-avantages`,
    faqs: [
      { question: "Qu'est-ce que la force exécutoire d'un bail notarié ?", answer: "Un bail notarié vaut titre exécutoire : en cas d'impayés, le propriétaire peut directement saisir un huissier pour récupérer les loyers dus ou expulser le locataire, sans passer par un jugement préalable." },
      { question: "Combien coûte la rédaction d'un bail notarié ?", answer: "Les émoluments sont réglementés selon la durée du bail et le loyer annuel : environ 250 à 600 € TTC pour un bail d'habitation standard, partagés entre propriétaire et locataire." },
      { question: "Un bail notarié est-il obligatoire pour les baux commerciaux ?", answer: "Non, il n'est pas légalement obligatoire pour un bail commercial, mais il est fortement recommandé pour bénéficier de la force exécutoire et de la sécurité juridique lors de la cession du fonds de commerce." },
    ],
  },
  {
    slug: "sci-is-ou-ir",
    title: "SCI à l'IS ou à l'IR : avantages et conseils notaire",
    excerpt: "SCI à l'IS ou à l'IR notaire avantages : fiscalité comparée, amortissement, imposition des loyers et transmission. Quel régime fiscal choisir pour votre SCI en 2026 ?",
    date: "2026-06-09",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["SCI à l'IS ou à l'IR notaire avantages", "SCI IS IR comparaison", "fiscalité SCI", "SCI impôt sur les sociétés"],
    canonicalUrl: `${BASE}/blog/sci-is-ou-ir`,
    faqs: [
      { question: "Quelle est la différence entre SCI à l'IR et SCI à l'IS ?", answer: "La SCI à l'IR est transparente : chaque associé est imposé sur sa quote-part de bénéfices à son taux marginal. La SCI à l'IS est imposée au niveau de la société (15 % jusqu'à 42 500 €, 25 % au-delà), les dividendes étant taxés lors de la distribution." },
      { question: "Peut-on changer le régime fiscal d'une SCI après sa création ?", answer: "Oui, une SCI à l'IR peut opter pour l'IS à tout moment, mais cette décision est irréversible. À l'inverse, une SCI à l'IS ne peut pas revenir à l'IR sans dissolution et recréation." },
      { question: "La SCI à l'IS permet-elle d'amortir les biens ?", answer: "Oui, c'est l'un des grands avantages de l'IS : la valeur des immeubles peut être amortie comptablement, réduisant ainsi le résultat imposable et donc l'impôt dû chaque année." },
    ],
  },
  {
    slug: "donation-partage-guide",
    title: "Donation-partage : le guide complet 2026",
    excerpt: "La donation-partage notaire permet de transmettre et répartir son patrimoine de son vivant. Avantages fiscaux, fonctionnement et étapes détaillés.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Donation",
    keywords: ["donation-partage notaire avantages", "donation partage enfants", "transmission patrimoine vivant"],
    canonicalUrl: `${BASE}/blog/donation-partage-guide`,
    faqs: [
      { question: "La donation-partage est-elle obligatoirement chez le notaire ?", answer: "Oui, la donation-partage est un acte notarié obligatoire. Aucune forme sous seing privé n'est valable pour ce type d'acte." },
      { question: "Quelle est la différence entre donation simple et donation-partage ?", answer: "La donation-partage est irrévocable et cristallise les valeurs au jour de l'acte, ce qui évite les conflits au moment de la succession. La donation simple est rapportable et réévaluée au jour du décès." },
      { question: "Un enfant peut-il être exclu d'une donation-partage ?", answer: "Non, la donation-partage doit réunir tous les enfants héritiers présomptifs, même s'ils peuvent recevoir des parts d'inégale valeur (avec leur accord)." },
    ],
  },
  {
    slug: "abattement-donation-enfant-2026",
    title: "Abattement donation enfant 2026 : montants et règles",
    excerpt: "Abattement donation enfant 2026 : 100 000 € par parent, renouvelable tous les 15 ans. Découvrez les montants, conditions et stratégies pour optimiser vos dons.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Donation",
    keywords: ["abattement donation enfant 2026", "abattement fiscal donation", "droits de donation enfant"],
    canonicalUrl: `${BASE}/blog/abattement-donation-enfant-2026`,
    faqs: [
      { question: "Quel est l'abattement pour une donation à un enfant en 2026 ?", answer: "Chaque parent peut donner jusqu'à 100 000 € à chaque enfant sans droits de donation, soit 200 000 € au total pour un couple." },
      { question: "L'abattement de 100 000 € se cumule-t-il entre frères et sœurs ?", answer: "Non, l'abattement de 100 000 € est propre à chaque couple parent-enfant. Un enfant peut cumuler 100 000 € de son père et 100 000 € de sa mère." },
      { question: "Peut-on faire plusieurs donations successives pour profiter de l'abattement ?", answer: "Oui, l'abattement se renouvelle tous les 15 ans. Il est donc possible de réaliser plusieurs donations échelonnées pour transmettre un patrimoine important en franchise de droits." },
    ],
  },
  {
    slug: "donation-usufruit-nue-propriete",
    title: "Donation usufruit et nue-propriété : guide notaire",
    excerpt: "Donation usufruit nue-propriété : comprendre le démembrement, les avantages fiscaux et les règles notariales pour transmettre intelligemment votre patrimoine.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Donation",
    keywords: ["donation usufruit nue-propriété", "démembrement donation", "transmettre nue-propriété enfants"],
    canonicalUrl: `${BASE}/blog/donation-usufruit-nue-propriete`,
    faqs: [
      { question: "Quelle est la différence entre l'usufruitier et le nu-propriétaire ?", answer: "L'usufruitier a le droit d'utiliser le bien et d'en percevoir les revenus (loyers). Le nu-propriétaire possède le bien sans pouvoir en jouir, mais récupère la pleine propriété au décès de l'usufruitier." },
      { question: "Quels sont les avantages fiscaux de la donation en nue-propriété ?", answer: "Les droits de donation sont calculés sur la valeur de la nue-propriété uniquement, inférieure à la pleine propriété. L'enfant récupère ensuite la pleine propriété gratuitement au décès du parent." },
      { question: "Faut-il un notaire pour donner la nue-propriété d'un bien immobilier ?", answer: "Oui, la donation d'un bien immobilier (en pleine propriété, usufruit ou nue-propriété) exige obligatoirement un acte notarié." },
    ],
  },
  {
    slug: "demembrement-propriete-notaire",
    title: "Démembrement de propriété : rôle du notaire",
    excerpt: "Démembrement de propriété notaire : usufruit, nue-propriété, fiscalité et stratégies patrimoniales. Guide expert pour optimiser votre transmission.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Donation",
    keywords: ["démembrement de propriété notaire", "usufruit nue-propriété", "barème fiscal démembrement"],
    canonicalUrl: `${BASE}/blog/demembrement-propriete-notaire`,
    faqs: [
      { question: "Qu'est-ce que le démembrement de propriété ?", answer: "C'est la division d'un bien en deux droits : l'usufruit (droit d'usage et de perception des revenus) et la nue-propriété (titre de propriété sans jouissance). Réunis, ils forment la pleine propriété." },
      { question: "Comment est calculée la valeur de la nue-propriété ?", answer: "Le Code général des impôts fixe un barème fiscal selon l'âge de l'usufruitier : plus le donateur est jeune, plus l'usufruit a de valeur et moins la nue-propriété vaut." },
      { question: "Le démembrement s'applique-t-il aux comptes-titres et à l'assurance-vie ?", answer: "Oui, le démembrement peut porter sur des valeurs mobilières, des parts de SCI ou une assurance-vie. Les règles fiscales diffèrent selon la nature du bien." },
    ],
  },
  {
    slug: "donation-simple-enfants",
    title: "Faire une donation à ses enfants chez le notaire",
    excerpt: "Faire une donation à ses enfants notaire : procédure, coûts, abattements et conseils. Tout ce qu'il faut savoir pour transmettre votre patrimoine sereinement.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Donation",
    keywords: ["faire une donation à ses enfants notaire", "donation simple enfants", "acte notarié donation"],
    canonicalUrl: `${BASE}/blog/donation-simple-enfants`,
    faqs: [
      { question: "Combien coûte une donation à ses enfants chez le notaire ?", answer: "Les émoluments du notaire sont réglementés et calculés sur la valeur du bien donné. Comptez environ 1 à 2 % de la valeur, auxquels s'ajoutent les droits de donation éventuels et les débours." },
      { question: "Peut-on faire une donation sans notaire à ses enfants ?", answer: "Pour un bien immobilier, le notaire est obligatoire. Pour des sommes d'argent ou des biens meubles, le don manuel sans notaire est possible, mais doit être déclaré aux impôts." },
      { question: "Une donation peut-elle être annulée ?", answer: "La donation est en principe irrévocable une fois acceptée. Seules des causes légales permettent la révocation : ingratitude du donataire, survenance d'enfants, ou inexécution des charges." },
    ],
  },
  {
    slug: "don-manuel-declaration",
    title: "Don manuel : comment le déclarer au notaire et aux impôts ?",
    excerpt: "Don manuel comment le déclarer notaire : formulaire 2735, délais, abattements et risques en cas d'oubli. Le guide pratique pour être en règle.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Donation",
    keywords: ["don manuel comment le déclarer notaire", "déclaration don manuel", "formulaire 2735"],
    canonicalUrl: `${BASE}/blog/don-manuel-declaration`,
    faqs: [
      { question: "Un don manuel doit-il obligatoirement être déclaré ?", answer: "Tout don manuel révélé à l'administration doit être déclaré. La révélation peut être volontaire (formulaire 2735) ou forcée (contrôle fiscal). L'absence de déclaration expose à des pénalités." },
      { question: "Quel est le délai pour déclarer un don manuel ?", answer: "Il n'y a pas de délai légal strict, mais la déclaration doit intervenir dans le mois suivant la révélation du don ou la demande de l'administration fiscale." },
      { question: "Les dons manuels bénéficient-ils des mêmes abattements que les donations notariées ?", answer: "Oui, les dons manuels déclarés bénéficient des mêmes abattements : 100 000 € par parent et par enfant, renouvelables tous les 15 ans." },
    ],
  },
  {
    slug: "donation-temporaire-usufruit",
    title: "Donation temporaire d'usufruit : guide notaire complet",
    excerpt: "Donation temporaire d'usufruit notaire : fonctionnement, avantages fiscaux et patrimoniaux, conditions. Idéale pour aider un enfant étudiant ou financer un projet.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Donation",
    keywords: ["donation temporaire d'usufruit notaire", "usufruit temporaire", "transmettre revenus enfant"],
    canonicalUrl: `${BASE}/blog/donation-temporaire-usufruit`,
    faqs: [
      { question: "Quelle est la durée minimale d'une donation temporaire d'usufruit ?", answer: "La donation temporaire d'usufruit doit avoir une durée minimale de 3 ans pour être fiscalement efficace. La durée maximale n'est pas fixée par la loi." },
      { question: "Quels sont les avantages fiscaux pour le donateur ?", answer: "Pendant la durée de l'usufruit temporaire, les revenus du bien sortent du patrimoine du donateur, ce qui réduit son ISF/IFI et son impôt sur le revenu." },
      { question: "La donation temporaire d'usufruit doit-elle passer chez le notaire ?", answer: "Oui, si elle porte sur un bien immobilier. Pour des valeurs mobilières, un acte notarié reste vivement conseillé pour éviter les requalifications fiscales." },
    ],
  },
  {
    slug: "pacte-tontine-notaire",
    title: "Pacte tontine en immobilier : rôle du notaire",
    excerpt: "Pacte tontine immobilier notaire : fonctionnement, avantages pour protéger votre concubin, fiscalité et comparaison avec d'autres outils patrimoniaux.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Donation",
    keywords: ["pacte tontine immobilier notaire", "clause tontine", "protection concubin immobilier"],
    canonicalUrl: `${BASE}/blog/pacte-tontine-notaire`,
    faqs: [
      { question: "Qu'est-ce qu'un pacte tontine en immobilier ?", answer: "La clause tontinière stipule que le survivant des deux acquéreurs sera réputé avoir été seul propriétaire du bien depuis l'origine, lui évitant ainsi de payer des droits de succession sur la moitié du bien." },
      { question: "Le pacte tontine est-il avantageux pour les concubins ?", answer: "Oui, c'est l'un des rares outils permettant à un concubin survivant de recueillir un bien immobilier avec une fiscalité limitée, sans devoir supporter les 60 % de droits de succession ordinaires." },
      { question: "Peut-on vendre un bien acheté avec clause tontinière ?", answer: "La vente nécessite l'accord des deux parties. En cas de désaccord, la situation peut devenir bloquée car aucun des deux ne peut forcer le partage, contrairement à l'indivision classique." },
    ],
  },
  {
    slug: "assurance-vie-clause-beneficiaire",
    title: "Assurance vie : rédiger sa clause bénéficiaire chez le notaire",
    excerpt: "Assurance vie clause bénéficiaire notaire : comment la rédiger, la modifier et l'optimiser pour transmettre efficacement hors succession.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Donation",
    keywords: ["assurance vie clause bénéficiaire notaire", "clause bénéficiaire assurance vie", "optimiser transmission assurance vie"],
    canonicalUrl: `${BASE}/blog/assurance-vie-clause-beneficiaire`,
    faqs: [
      { question: "Faut-il passer chez un notaire pour rédiger la clause bénéficiaire ?", answer: "Ce n'est pas obligatoire, mais vivement recommandé pour une clause complexe (démembrement, personnes multiples, conditions). Le notaire en conserve une copie sécurisée." },
      { question: "Peut-on modifier la clause bénéficiaire à tout moment ?", answer: "Oui, la clause est librement modifiable à tout moment, sauf si le bénéficiaire a accepté sa désignation. Dans ce cas, toute modification requiert son accord." },
      { question: "Que se passe-t-il si la clause bénéficiaire est mal rédigée ?", answer: "Une clause trop vague ou contradictoire peut entraîner des conflits entre héritiers, voire la réintégration des capitaux dans la succession avec les droits correspondants." },
    ],
  },
  {
    slug: "donation-avant-deces",
    title: "Faire une donation avant décès : stratégies notaire 2026",
    excerpt: "Faire une donation avant décès notaire : abattements, types de donation et stratégies patrimoniales pour réduire les droits de succession de vos héritiers.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Donation",
    keywords: ["faire une donation avant décès notaire", "donation anticipée succession", "transmettre avant décès"],
    canonicalUrl: `${BASE}/blog/donation-avant-deces`,
    faqs: [
      { question: "Pourquoi faire une donation plutôt qu'attendre la succession ?", answer: "Une donation permet de profiter des abattements fiscaux renouvelables tous les 15 ans, de figer les valeurs au jour de l'acte et d'éviter les conflits entre héritiers à votre décès." },
      { question: "Peut-on faire une donation et rester dans le bien ?", answer: "Oui, via la donation avec réserve d'usufruit. Vous donnez la nue-propriété à vos enfants mais continuez à vivre dans le logement ou à en percevoir les loyers." },
      { question: "La donation est-elle prise en compte dans la succession ?", answer: "Oui, les donations consenties à un héritier sont en principe rapportables à la succession (rapport civil) pour rétablir l'égalité entre héritiers, sauf dispense expresse." },
    ],
  },
  {
    slug: "divorce-notaire-role",
    title: "Divorce et notaire : quel rôle en consentement mutuel ?",
    excerpt: "Divorce par consentement mutuel : découvrez le rôle clé du notaire, les étapes, le coût et les délais pour divorcer sans juge en France.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Famille",
    keywords: ["divorce notaire consentement mutuel", "convention de divorce", "divorce sans juge notaire"],
    canonicalUrl: `${BASE}/blog/divorce-notaire-role`,
    faqs: [
      { question: "Le notaire est-il obligatoire pour un divorce par consentement mutuel ?", answer: "Oui, depuis la réforme de 2017, le notaire est chargé de déposer et conserver la convention de divorce. Il remplace le juge dans ce type de divorce." },
      { question: "Combien coûte un divorce par consentement mutuel chez le notaire ?", answer: "Les émoluments du notaire pour le dépôt de la convention sont fixés à 50 € HT par époux (soit 60 € TTC chacun). Les honoraires des avocats sont en sus." },
      { question: "Combien de temps dure un divorce par consentement mutuel ?", answer: "La procédure dure en général de 2 à 4 mois : rédaction de la convention par les avocats, délai de réflexion de 15 jours, puis dépôt chez le notaire." },
    ],
  },
  {
    slug: "mandat-protection-future",
    title: "Mandat de protection future chez le notaire : guide complet",
    excerpt: "Mandat de protection future notaire : anticipez la perte d'autonomie, protégez vos biens et désignez votre mandataire de confiance dès aujourd'hui.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Famille",
    keywords: ["mandat de protection future notaire", "protection future autonomie", "mandat notarié MPF"],
    canonicalUrl: `${BASE}/blog/mandat-protection-future`,
    faqs: [
      { question: "Quelle est la différence entre mandat de protection future et tutelle ?", answer: "Le mandat de protection future est choisi librement, avant toute altération des facultés. La tutelle est une mesure judiciaire imposée lorsqu'une personne n'est plus en mesure de se protéger seule." },
      { question: "Le mandat de protection future doit-il être notarié ?", answer: "Deux formes existent : la forme notariée (obligatoire pour protéger les biens) et la forme sous seing privé (pour la personne uniquement). La forme notariée est recommandée pour une protection complète." },
      { question: "Quand le mandat de protection future entre-t-il en vigueur ?", answer: "Il entre en vigueur uniquement en cas d'altération médicalement constatée des facultés du mandant, sur décision du médecin habilité et enregistrement au greffe du tribunal." },
    ],
  },
  {
    slug: "adoption-notaire-procedure",
    title: "Adoption et notaire : procédure et actes à connaître",
    excerpt: "Adoption notaire procédure : rôle du notaire dans l'adoption simple et plénière, actes requis, consentement et implications successorales expliqués.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Famille",
    keywords: ["adoption notaire procédure", "adoption simple notaire", "adoption plénière acte notarié"],
    canonicalUrl: `${BASE}/blog/adoption-notaire-procedure`,
    faqs: [
      { question: "Le notaire est-il obligatoire pour une adoption ?", answer: "Non, l'adoption est prononcée par un tribunal judiciaire. Mais le notaire intervient pour rédiger le consentement authentique à l'adoption et pour les implications successorales." },
      { question: "Quelle est la différence entre adoption simple et adoption plénière ?", answer: "L'adoption plénière rompt tout lien avec la famille d'origine et est irrévocable. L'adoption simple maintient les liens d'origine et peut être révoquée sous conditions." },
      { question: "L'adopté hérite-t-il comme un enfant biologique ?", answer: "En adoption plénière, oui : l'adopté a les mêmes droits successoraux qu'un enfant biologique. En adoption simple, il hérite dans les deux familles, mais les droits de succession diffèrent." },
    ],
  },
  {
    slug: "divorce-partage-biens",
    title: "Partage des biens après divorce : rôle du notaire",
    excerpt: "Partage des biens après divorce notaire : liquidation du régime matrimonial, biens communs, immobilier et délais. Guide complet pour sécuriser votre séparation.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Famille",
    keywords: ["partage des biens après divorce notaire", "liquidation régime matrimonial", "partage immobilier divorce"],
    canonicalUrl: `${BASE}/blog/divorce-partage-biens`,
    faqs: [
      { question: "Le notaire est-il obligatoire pour le partage après divorce ?", answer: "Oui, dès qu'il y a un bien immobilier à partager, l'intervention du notaire est obligatoire pour rédiger l'acte de partage publié à la publicité foncière." },
      { question: "Combien coûte le partage des biens après divorce ?", answer: "Un droit de partage de 2,5 % sur l'actif net partagé s'applique, auquel s'ajoutent les émoluments du notaire. Comptez globalement entre 4 et 6 % de la valeur des biens immobiliers." },
      { question: "Peut-on vendre le bien immobilier commun avant le divorce ?", answer: "Oui, les deux époux peuvent vendre conjointement pendant la procédure. Mais si l'un refuse, la vente ne peut être forcée qu'après le prononcé du divorce." },
    ],
  },
  {
    slug: "tutelle-curatelle-notaire",
    title: "Tutelle et curatelle : le rôle du notaire dans la procédure",
    excerpt: "Tutelle curatelle notaire procédure : comprendre les mesures de protection, le rôle du notaire et les démarches pour protéger un proche vulnérable.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Famille",
    keywords: ["tutelle curatelle notaire procédure", "protection juridique majeur", "mesure protection notaire"],
    canonicalUrl: `${BASE}/blog/tutelle-curatelle-notaire`,
    faqs: [
      { question: "Quelle est la différence entre tutelle et curatelle ?", answer: "La curatelle accompagne la personne dans ses actes importants. La tutelle la représente entièrement pour tous les actes. La curatelle est moins restrictive que la tutelle." },
      { question: "Le notaire peut-il être tuteur ?", answer: "Le notaire n'est pas tuteur, mais il conseille le tuteur et rédige les actes notariés nécessaires à la gestion du patrimoine du majeur protégé (vente, donation, etc.)." },
      { question: "Quels actes nécessitent un notaire sous tutelle ?", answer: "La vente d'un bien immobilier, une donation, un emprunt ou un contrat de mariage nécessitent tous une autorisation judiciaire ET un acte notarié sous tutelle." },
    ],
  },
  {
    slug: "procuration-achat-immobilier",
    title: "Procuration notaire pour achat immobilier : mode d'emploi",
    excerpt: "Procuration notaire achat immobilier : quand y recourir, comment l'établir, son coût et sa durée de validité pour sécuriser votre transaction à distance.",
    date: "2026-06-09",
    readingTime: 6,
    category: "Guide",
    keywords: ["procuration notaire achat immobilier", "procuration authentique immobilier", "signature par procuration notaire"],
    canonicalUrl: `${BASE}/blog/procuration-achat-immobilier`,
    faqs: [
      { question: "Une procuration pour achat immobilier doit-elle être notariée ?", answer: "Oui, pour signer un acte authentique de vente par procuration, la procuration doit elle-même être un acte authentique notarié, reconnue par tous les notaires français et étrangers." },
      { question: "Combien coûte une procuration chez le notaire ?", answer: "Le coût d'une procuration notariée pour achat immobilier est d'environ 75 à 150 € TTC, auquel peuvent s'ajouter des frais si la procuration est établie à l'étranger." },
      { question: "Quelle est la durée de validité d'une procuration notariée ?", answer: "Une procuration notariée ne fait l'objet d'aucune durée légale de validité, mais en pratique les notaires recommandent de ne pas dépasser 3 mois entre la procuration et l'acte de vente." },
    ],
  },
  {
    slug: "changement-regime-matrimonial",
    title: "Changer de régime matrimonial chez le notaire : guide 2026",
    excerpt: "Changer de régime matrimonial notaire : conditions, procédure, coût et délais. Découvrez comment passer de la séparation de biens à la communauté et inversement.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Mariage",
    keywords: ["changer de régime matrimonial notaire", "changement régime matrimonial procédure", "modification contrat de mariage"],
    canonicalUrl: `${BASE}/blog/changement-regime-matrimonial`,
    faqs: [
      { question: "Après combien de temps peut-on changer de régime matrimonial ?", answer: "Le changement de régime matrimonial n'est possible qu'après deux ans d'application du régime actuel. Cette condition vise à éviter les changements opportunistes au détriment des créanciers." },
      { question: "Faut-il l'accord du juge pour changer de régime matrimonial ?", answer: "Non, depuis 2007 l'homologation judiciaire n'est plus obligatoire sauf opposition d'un créancier ou d'un enfant majeur. Dans ce cas, le juge est saisi pour statuer." },
      { question: "Combien coûte un changement de régime matrimonial ?", answer: "Les émoluments du notaire sont réglementés : environ 510 € HT, auxquels s'ajoutent les débours et frais de publicité (environ 150 à 300 €). Le total avoisine 800 à 1 000 € TTC." },
    ],
  },
  {
    slug: "pacs-notaire-avantages",
    title: "PACS chez le notaire : avantages fiscaux et protections",
    excerpt: "PACS chez le notaire avantages fiscaux : imposition commune, succession, régime patrimonial et protection du partenaire. Tout ce que vous devez savoir en 2026.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Mariage",
    keywords: ["PACS chez le notaire avantages fiscaux", "PACS notaire 2026", "avantages PACS fiscal succession"],
    canonicalUrl: `${BASE}/blog/pacs-notaire-avantages`,
    faqs: [
      { question: "Est-il obligatoire de passer son PACS chez le notaire ?", answer: "Non, le PACS peut être conclu en mairie. Mais le notaire est obligatoire si la convention de PACS contient des dispositions relatives aux biens ou si les partenaires souhaitent une convention sur mesure." },
      { question: "Le PACS protège-t-il le partenaire survivant ?", answer: "Partiellement. Le partenaire pacsé ne bénéficie d'aucun droit successoral légal, mais est exonéré de droits de succession sur les legs. Un testament est donc indispensable pour lui transmettre des biens." },
      { question: "Quelle est la fiscalité du PACS par rapport au mariage ?", answer: "Les partenaires pacsés bénéficient de l'imposition commune dès l'année du PACS, des mêmes abattements fiscaux pour les donations et de l'exonération totale de droits de succession." },
    ],
  },
  {
    slug: "contrat-mariage-communaute-acquets",
    title: "Communauté réduite aux acquêts : le régime légal expliqué",
    excerpt: "Contrat de mariage communauté réduite aux acquêts : fonctionnement, biens propres, biens communs et conseils du notaire pour bien comprendre votre régime légal.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Mariage",
    keywords: ["contrat de mariage communauté réduite aux acquêts", "régime légal mariage", "biens communs biens propres"],
    canonicalUrl: `${BASE}/blog/contrat-mariage-communaute-acquets`,
    faqs: [
      { question: "Qu'est-ce que la communauté réduite aux acquêts ?", answer: "C'est le régime matrimonial légal en France : les biens acquis avant le mariage ou reçus par donation/succession restent propres, tandis que tout ce qui est acquis pendant le mariage devient commun." },
      { question: "Un bien acheté avec de l'argent personnel reste-t-il propre en communauté ?", answer: "Oui, à condition de faire une déclaration de remploi dans l'acte d'achat notarié précisant que les fonds utilisés sont propres. Sans cette déclaration, le bien peut devenir commun." },
      { question: "Peut-on modifier la communauté réduite aux acquêts par contrat ?", answer: "Oui, les époux peuvent aménager ce régime via un contrat de mariage notarié : clause de préciput, clause d'attribution intégrale, adjonction d'une société d'acquêts limitée, etc." },
    ],
  },
  {
    slug: "separation-de-biens-avantages",
    title: "Séparation de biens : avantages et inconvénients en 2026",
    excerpt: "Séparation de biens avantages inconvénients : protection des patrimoines, risques pour le conjoint faible, fiscalité et conseils du notaire pour bien choisir.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Mariage",
    keywords: ["séparation de biens avantages inconvénients", "régime séparation de biens notaire", "contrat mariage séparation"],
    canonicalUrl: `${BASE}/blog/separation-de-biens-avantages`,
    faqs: [
      { question: "La séparation de biens protège-t-elle contre les dettes du conjoint ?", answer: "Oui, c'est son principal avantage : les créanciers d'un époux ne peuvent pas saisir les biens personnels de l'autre, sauf pour les dettes ménagères solidaires." },
      { question: "La séparation de biens est-elle défavorable en cas de divorce ?", answer: "Elle peut l'être pour le conjoint ayant moins travaillé ou contribué moins financièrement : chacun repart avec ses biens sans compensation, sauf créance entre époux prouvée." },
      { question: "Peut-on ajouter une société d'acquêts à la séparation de biens ?", answer: "Oui, cette clause permet de créer une masse de biens communs limitée (ex: le logement familial) tout en maintenant la séparation pour le reste du patrimoine." },
    ],
  },
  {
    slug: "donation-entre-epoux",
    title: "Donation entre époux : avantage du survivant chez le notaire",
    excerpt: "Donation entre époux avantage survivant notaire : protégez votre conjoint grâce à la donation au dernier vivant. Fonctionnement, coût et fiscalité expliqués.",
    date: "2026-06-09",
    readingTime: 7,
    category: "Mariage",
    keywords: ["donation entre époux avantage survivant notaire", "donation au dernier vivant", "protection conjoint décès"],
    canonicalUrl: `${BASE}/blog/donation-entre-epoux`,
    faqs: [
      { question: "La donation entre époux est-elle automatique lors du mariage ?", answer: "Non, elle doit être établie par acte notarié. Elle est distincte du régime matrimonial et permet d'avantager le conjoint survivant au-delà de ses droits légaux." },
      { question: "La donation entre époux peut-elle être révoquée ?", answer: "Oui, contrairement aux donations entre vifs ordinaires, la donation entre époux peut être révoquée à tout moment, unilatéralement, sans motif, et est automatiquement révoquée par le divorce." },
      { question: "Combien coûte une donation entre époux chez le notaire ?", answer: "Les émoluments sont réglementés : environ 136 € HT (163 € TTC), auxquels s'ajoutent de légers débours. C'est l'un des actes notariaux les moins coûteux au regard de la protection qu'il offre." },
    ],
  },
  {
    slug: "holding-familiale-notaire",
    title: "Holding familiale : le rôle clé du notaire dans sa création",
    excerpt: "La holding familiale est un outil puissant pour structurer et transmettre un patrimoine. Découvrez comment le notaire intervient à chaque étape.",
    date: "2025-11-03",
    readingTime: 8,
    category: "Patrimoine",
    keywords: ["holding familiale notaire", "création holding familiale", "transmission patrimoine holding", "SCI holding notaire"],
    canonicalUrl: "https://notaires.io/blog/holding-familiale-notaire",
    faqs: [
      { question: "Est-il obligatoire de passer par un notaire pour créer une holding ?", answer: "Non, mais le notaire est indispensable si la holding reçoit des biens immobiliers ou si vous souhaitez sécuriser juridiquement les statuts et les pactes d'associés." },
      { question: "Quels sont les avantages fiscaux d'une holding familiale ?", answer: "Le régime mère-fille exonère les dividendes à 95 %, et le pacte Dutreil peut réduire de 75 % la base taxable lors de la transmission." }
    ]
  },
  {
    slug: "transmission-entreprise-notaire",
    title: "Transmission d'entreprise : pourquoi le notaire est indispensable",
    excerpt: "Cession, donation, succession : le notaire sécurise chaque mode de transmission d'entreprise. Étapes, fiscalité et conseils pratiques.",
    date: "2025-11-05",
    readingTime: 9,
    category: "Patrimoine",
    keywords: ["transmission entreprise notaire", "cession entreprise notaire", "donation entreprise notaire", "fiscalité transmission entreprise"],
    canonicalUrl: "https://notaires.io/blog/transmission-entreprise-notaire",
    faqs: [
      { question: "Le notaire intervient-il dans la cession d'un fonds de commerce ?", answer: "Oui, si l'acte doit être publié ou si le cédant souhaite une sécurité maximale. La cession de parts sociales peut se faire sous seing privé, mais le notaire est recommandé pour les montants importants." },
      { question: "Peut-on transmettre une entreprise par donation ?", answer: "Oui, via une donation en démembrement ou une donation-partage. Combinée au pacte Dutreil, l'exonération peut atteindre 75 % de la valeur des parts." }
    ]
  },
  {
    slug: "pacte-dutreil-transmission",
    title: "Pacte Dutreil : transmettre son entreprise avec 75 % d'exonération",
    excerpt: "Le pacte Dutreil permet de transmettre une entreprise familiale avec une exonération de 75 % des droits de mutation. Conditions, mécanisme et rôle du notaire.",
    date: "2025-11-07",
    readingTime: 10,
    category: "Patrimoine",
    keywords: ["pacte Dutreil", "transmission entreprise familiale", "exonération droits succession entreprise", "notaire pacte Dutreil"],
    canonicalUrl: "https://notaires.io/blog/pacte-dutreil-transmission",
    faqs: [
      { question: "Quelles entreprises peuvent bénéficier du pacte Dutreil ?", answer: "Toutes les entreprises ayant une activité industrielle, commerciale, artisanale, agricole ou libérale, qu'elles soient en nom propre ou en société (SARL, SAS, SA…)." },
      { question: "Que se passe-t-il si les conditions du pacte Dutreil ne sont pas respectées ?", answer: "Le régime de faveur est remis en cause et les droits sont rappelés avec des intérêts de retard. Le notaire assure le suivi pour éviter ce risque." }
    ]
  },
  {
    slug: "donation-cession-entreprise",
    title: "Donation avant cession d'entreprise : une stratégie fiscale avec le notaire",
    excerpt: "Donner ses parts avant de les vendre permet d'effacer la plus-value et de réduire les droits de succession. Le notaire orchestre cette opération délicate.",
    date: "2025-11-10",
    readingTime: 8,
    category: "Patrimoine",
    keywords: ["donation avant cession entreprise", "plus-value donation notaire", "optimisation fiscale cession", "donation parts sociales notaire"],
    canonicalUrl: "https://notaires.io/blog/donation-cession-entreprise",
    faqs: [
      { question: "La donation avant cession efface-t-elle toujours la plus-value ?", answer: "En principe oui, car la valeur retenue pour la cession est la valeur au jour de la donation. Mais l'opération peut être requalifiée si la cession était préalablement organisée." },
      { question: "Quel délai faut-il respecter entre la donation et la cession ?", answer: "La loi ne fixe pas de délai précis, mais un délai raisonnable (généralement 3 à 6 mois) est recommandé pour éviter la requalification." }
    ]
  },
  {
    slug: "optimisation-patrimoniale",
    title: "Optimisation patrimoniale : le notaire au cœur de votre stratégie",
    excerpt: "Démembrement, SCI, assurance-vie, donation : le notaire identifie les leviers d'optimisation patrimoniale adaptés à votre situation familiale et fiscale.",
    date: "2025-11-12",
    readingTime: 8,
    category: "Patrimoine",
    keywords: ["optimisation patrimoniale notaire", "stratégie patrimoine notaire", "démembrement de propriété", "SCI optimisation fiscale"],
    canonicalUrl: "https://notaires.io/blog/optimisation-patrimoniale",
    faqs: [
      { question: "À partir de quel patrimoine consulter un notaire pour l'optimisation ?", answer: "Dès 300 000 € de patrimoine net, les leviers d'optimisation (démembrement, SCI, donation) justifient une consultation notariale." },
      { question: "Le notaire peut-il me conseiller sur l'assurance-vie ?", answer: "Le notaire peut vous expliquer le traitement successoral de l'assurance-vie et sa coordination avec votre succession, mais la souscription reste du ressort d'un conseiller financier." }
    ]
  },
  {
    slug: "notaire-visio-comment-ca-marche",
    title: "Notaire en visio : comment ça marche concrètement ?",
    excerpt: "Rendez-vous en visioconférence, acte notarié à distance, signature électronique : découvrez le fonctionnement complet du notaire en ligne.",
    date: "2025-11-14",
    readingTime: 7,
    category: "Guide",
    keywords: ["notaire visio comment ça marche", "rendez-vous notaire visioconférence", "acte notarié à distance", "comparaître à distance notaire"],
    canonicalUrl: "https://notaires.io/blog/notaire-visio-comment-ca-marche",
    faqs: [
      { question: "Tous les actes notariés peuvent-ils se faire en visio ?", answer: "La majorité des actes courants oui : donations, testaments, mandats de protection future, certains actes immobiliers. Les actes complexes avec de nombreuses parties peuvent nécessiter une présence physique." },
      { question: "La signature électronique d'un acte notarié a-t-elle la même valeur qu'une signature physique ?", answer: "Oui, depuis le décret de 2020 les actes authentiques électroniques ont la même valeur juridique que les actes papier, sous réserve du respect du cadre réglementaire." }
    ]
  },
  {
    slug: "tarifs-honoraires-notaire",
    title: "Tarifs et honoraires du notaire : tout comprendre sur les coûts",
    excerpt: "Émoluments réglementés, honoraires libres, débours, TVA : décryptez la facture d'un notaire et comprenez pourquoi les tarifs varient.",
    date: "2025-11-17",
    readingTime: 9,
    category: "Guide",
    keywords: ["tarifs notaire", "honoraires notaire", "émoluments notaire", "frais notaire calcul"],
    canonicalUrl: "https://notaires.io/blog/tarifs-honoraires-notaire",
    faqs: [
      { question: "Les honoraires du notaire sont-ils négociables ?", answer: "Les émoluments sont réglementés et non négociables. En revanche, pour les prestations intellectuelles (conseil patrimonial, consultation), les honoraires libres peuvent être discutés." },
      { question: "Que sont les débours dans une facture de notaire ?", answer: "Les débours sont les frais que le notaire avance pour votre compte : droits d'enregistrement, taxe de publicité foncière, frais de géomètre, etc. Ils sont refacturés au réel." }
    ]
  },
  {
    slug: "acte-notarie-force-executoire",
    title: "Acte notarié et force exécutoire : une garantie unique",
    excerpt: "La force exécutoire d'un acte notarié permet d'agir immédiatement en cas d'impayé, sans procès. Comprendre cette garantie essentielle.",
    date: "2025-11-19",
    readingTime: 7,
    category: "Guide",
    keywords: ["acte notarié force exécutoire", "titre exécutoire notaire", "recouvrement sans procès notaire", "acte authentique exécution"],
    canonicalUrl: "https://notaires.io/blog/acte-notarie-force-executoire",
    faqs: [
      { question: "Qu'est-ce qui distingue un acte notarié d'un acte sous seing privé ?", answer: "L'acte notarié a la force probante absolue (on ne peut pas nier sa signature) et la force exécutoire (huissier peut agir sans jugement). L'acte sous seing privé n'a ni l'un ni l'autre." },
      { question: "La force exécutoire s'applique-t-elle à toutes les obligations de l'acte ?", answer: "Non, seulement aux obligations de payer des sommes d'argent. Pour les obligations de faire ou ne pas faire, un jugement reste nécessaire." }
    ]
  },
  {
    slug: "comment-choisir-son-notaire",
    title: "Comment choisir son notaire ? Les critères essentiels",
    excerpt: "Proximité, spécialisation, disponibilité, réputation : tous les critères pour choisir le bon notaire selon votre projet de vie.",
    date: "2025-11-21",
    readingTime: 6,
    category: "Guide",
    keywords: ["comment choisir notaire", "choisir bon notaire", "critères choix notaire", "notaire spécialisé immobilier succession"],
    canonicalUrl: "https://notaires.io/blog/comment-choisir-son-notaire",
    faqs: [
      { question: "Peut-on changer de notaire en cours d'opération ?", answer: "Oui, vous pouvez changer de notaire à tout moment. Les honoraires dus au notaire initial sont calculés au prorata des diligences effectuées." },
      { question: "Est-il préférable d'avoir le même notaire que le vendeur dans une transaction immobilière ?", answer: "Non, vous avez tout intérêt à avoir votre propre notaire. Les deux notaires partagent les émoluments sans surcoût pour vous, et votre notaire défend vos seuls intérêts." }
    ]
  },
  {
    slug: "negocier-frais-notaire",
    title: "Peut-on négocier les frais de notaire ? Ce que dit la loi",
    excerpt: "Une remise de 20 % est désormais possible sur les émoluments pour les transactions au-delà de 100 000 €. Conditions, limites et conseils pratiques.",
    date: "2025-11-24",
    readingTime: 7,
    category: "Guide",
    keywords: ["négocier frais notaire", "remise émoluments notaire", "réduire frais notaire", "frais notaire négociables"],
    canonicalUrl: "https://notaires.io/blog/negocier-frais-notaire",
    faqs: [
      { question: "Quelle est la remise maximale que peut accorder un notaire ?", answer: "Depuis 2016, le notaire peut accorder une remise de 20 % maximum sur ses émoluments proportionnels pour les transactions supérieures à 100 000 €. Cette remise doit être identique pour tous les clients dans une même catégorie d'actes." },
      { question: "Les droits de mutation sont-ils négociables ?", answer: "Non. Les droits de mutation (environ 5,8 % du prix) sont des impôts collectés par l'État et les collectivités. Seuls les émoluments du notaire (environ 1 % du prix) peuvent faire l'objet d'une remise." }
    ]
  },

  {
    slug: "acte-sous-seing-prive-vs-notarie",
    title: "Acte sous seing privé vs acte notarié : lequel choisir ?",
    excerpt: "Quelles sont les différences juridiques entre un acte sous seing privé et un acte notarié ? Quand le recours au notaire est-il obligatoire ou recommandé ?",
    date: "2025-11-26",
    readingTime: 7,
    category: "Guide",
    keywords: ["acte sous seing privé vs notarié", "différence acte notarié", "quand passer chez le notaire", "acte authentique vs contrat privé"],
    canonicalUrl: "https://notaires.io/blog/acte-sous-seing-prive-vs-notarie",
    faqs: [
      { question: "Un acte sous seing privé est-il valide juridiquement ?", answer: "Oui, dans la plupart des cas. Mais il n'a pas la force probante ni la force exécutoire d'un acte notarié, et peut être plus facilement contesté." },
      { question: "Pour quels actes le notaire est-il obligatoire ?", answer: "Vente immobilière, donation, contrat de mariage, pacte civil de solidarité (PACS), constitution de société civile immobilière avec apport d'immeuble." }
    ]
  },
  {
    slug: "delai-signature-acte-notarie",
    title: "Délai pour signer chez le notaire : à quoi correspondent les 3 mois ?",
    excerpt: "Entre compromis et acte de vente, pourquoi faut-il 2 à 4 mois ? Découvrez toutes les étapes et les délais incompressibles d'une transaction immobilière.",
    date: "2025-11-28",
    readingTime: 7,
    category: "Guide",
    keywords: ["délai signature acte notarié", "délai entre compromis et acte vente", "3 mois notaire immobilier", "étapes signature notaire"],
    canonicalUrl: "https://notaires.io/blog/delai-signature-acte-notarie",
    faqs: [
      { question: "Peut-on signer un acte de vente en moins de 2 mois ?", answer: "Oui si l'acheteur n'a pas besoin de prêt bancaire (achat comptant). Le délai minimal purement légal est d'environ 3 semaines (droit de rétractation + délai de purge)." },
      { question: "Que se passe-t-il si le délai prévu est dépassé ?", answer: "Si le compromis fixe une date butoir, chaque partie peut invoquer le dépassement pour se désengager, sauf accord des deux parties pour proroger." }
    ]
  },
  {
    slug: "notaire-en-ligne-legalite",
    title: "Notaire en ligne : légalité, avantages et limites en 2025",
    excerpt: "Les plateformes de notaires en ligne se multiplient. Sont-elles légales ? Quels actes peut-on réaliser à distance ? Ce que dit la réglementation.",
    date: "2025-12-01",
    readingTime: 8,
    category: "Guide",
    keywords: ["notaire en ligne légalité", "acte notarié en ligne", "signature électronique notaire", "notaire digital France"],
    canonicalUrl: "https://notaires.io/blog/notaire-en-ligne-legalite",
    faqs: [
      { question: "Un acte signé avec un notaire en ligne a-t-il la même valeur qu'un acte papier ?", answer: "Oui, depuis le décret du 20 novembre 2020, l'acte authentique électronique a la même valeur juridique que l'acte authentique papier." },
      { question: "Quelle est la différence entre un notaire en ligne et une LegalTech juridique ?", answer: "Un notaire en ligne est un vrai notaire (officier public) qui vous reçoit à distance. Une LegalTech propose des services juridiques automatisés sans notaire — sans la même garantie légale." }
    ]
  },
  {
    slug: "remuneration-notaire-emoluments",
    title: "Rémunération du notaire : émoluments, honoraires et revenus réels",
    excerpt: "Comment est vraiment rémunéré un notaire ? Émoluments réglementés, revenus de l'étude, salaires des clercs : transparence sur une profession souvent méconnue.",
    date: "2025-12-03",
    readingTime: 7,
    category: "Guide",
    keywords: ["rémunération notaire", "salaire notaire", "émoluments notaire revenus", "combien gagne un notaire"],
    canonicalUrl: "https://notaires.io/blog/remuneration-notaire-emoluments",
    faqs: [
      { question: "Combien gagne un notaire en France ?", answer: "Le revenu moyen d'un notaire libéral en France est d'environ 150 000 à 200 000 € brut annuel, mais il varie considérablement selon la taille de l'étude et la région. Un notaire salarié gagne entre 40 000 et 80 000 € brut." },
      { question: "Les émoluments du notaire sont-ils les mêmes partout en France ?", answer: "Oui, les émoluments réglementés sont identiques partout. Seuls les honoraires libres (consultations, conseils) peuvent varier d'une étude à l'autre." }
    ]
  },
  {
    slug: "assurance-vie-hors-succession",
    title: "Assurance-vie hors succession : le rôle du notaire dans votre stratégie",
    excerpt: "L'assurance-vie échappe à la succession classique et offre une fiscalité privilégiée. Le notaire vous aide à l'intégrer dans une stratégie patrimoniale cohérente.",
    date: "2025-12-05",
    readingTime: 8,
    category: "Patrimoine",
    keywords: ["assurance-vie hors succession notaire", "assurance vie et succession", "bénéficiaire assurance vie notaire", "fiscalité assurance vie succession"],
    canonicalUrl: "https://notaires.io/blog/assurance-vie-hors-succession",
    faqs: [
      { question: "L'assurance-vie échappe-t-elle totalement à la succession ?", answer: "En principe oui pour les primes versées avant 70 ans (abattement de 152 500 € par bénéficiaire). Pour les primes versées après 70 ans, seuls les produits (gains) sont hors succession ; le capital intègre la succession à hauteur de l'excédent sur 30 500 €." },
      { question: "Le notaire peut-il rédiger la clause bénéficiaire de mon assurance-vie ?", answer: "Oui, une clause bénéficiaire peut être rédigée par acte notarié, ce qui la rend plus difficile à modifier ultérieurement (protection renforcée du bénéficiaire acceptant)." }
    ]
  },
  {
    slug: "prendre-rdv-notaire-en-ligne",
    title: "Prendre rendez-vous chez le notaire en ligne : guide complet 2025",
    excerpt: "Réserver une consultation notariale en ligne est désormais possible en quelques clics. Plateformes, délais, préparation du rendez-vous : tout ce qu'il faut savoir.",
    date: "2025-12-08",
    readingTime: 6,
    category: "Guide",
    keywords: ["prendre rendez-vous notaire en ligne", "réserver consultation notaire", "notaire rdv internet", "prise de rdv notaire"],
    canonicalUrl: "https://notaires.io/blog/prendre-rdv-notaire-en-ligne",
    faqs: [
      { question: "Peut-on prendre rendez-vous directement en ligne avec n'importe quel notaire ?", answer: "Pas encore tous. Environ 30 à 40 % des études proposent la prise de rendez-vous en ligne via leur site ou des plateformes dédiées. Les autres privilégient le téléphone ou l'email." },
      { question: "Quelle est la durée d'une première consultation notariale ?", answer: "Généralement 30 à 60 minutes selon la complexité du projet. Certains notaires proposent des consultations courtes de 20 minutes pour des questions simples." }
    ]
  },
  {
    slug: "premier-rdv-notaire-gratuit",
    title: "Premier rendez-vous chez le notaire : est-il gratuit ?",
    excerpt: "La première consultation notariale est-elle gratuite ? Dans quels cas le notaire facture-t-il ? Ce que dit la réglementation et les usages de la profession.",
    date: "2025-12-10",
    readingTime: 6,
    category: "Guide",
    keywords: ["premier rendez-vous notaire gratuit", "consultation notaire gratuite", "premier rdv notaire prix", "notaire consultation prix"],
    canonicalUrl: "https://notaires.io/blog/premier-rdv-notaire-gratuit",
    faqs: [
      { question: "La première consultation chez le notaire est-elle toujours gratuite ?", answer: "Non, c'est une pratique courante mais pas une obligation légale. Certaines études offrent le premier rendez-vous, d'autres facturent 150 à 300 € pour une consultation d'une heure." },
      { question: "Quand les honoraires du notaire sont-ils inclus dans les frais de l'acte ?", answer: "Pour les actes tarifés (vente immobilière, succession, donation), les émoluments incluent la consultation et le conseil liés à l'acte. Il n'y a pas de facturation séparée pour ces échanges." }
    ]
  },
  {
    slug: "rdv-notaire-urgent-rapide",
    title: "Rendez-vous notaire urgent : comment obtenir un créneau rapidement ?",
    excerpt: "Situation urgente nécessitant un acte notarié ? Voici comment obtenir un rendez-vous rapide avec un notaire, même en dehors des créneaux habituels.",
    date: "2025-12-12",
    readingTime: 5,
    category: "Guide",
    keywords: ["rendez-vous notaire urgent", "notaire urgence rapidement", "créneau notaire rapide", "notaire disponible urgent"],
    canonicalUrl: "https://notaires.io/blog/rdv-notaire-urgent-rapide",
    faqs: [
      { question: "Un notaire peut-il intervenir en dehors des heures de bureau pour une urgence ?", answer: "Oui, dans les situations véritablement urgentes (décès imminent, départ à l'étranger imprévu, acte d'état civil urgent), le notaire de garde ou d'astreinte peut intervenir." },
      { question: "Quelle est la différence entre un notaire de garde et un notaire d'urgence ?", answer: "Certaines chambres de notaires organisent un service de garde par roulement entre les études pour couvrir les urgences du week-end et des jours fériés. Renseignez-vous auprès de la chambre départementale des notaires." }
    ]
  },
  {
    slug: "rdv-notaire-en-visio",
    title: "Rendez-vous notaire en visio : mode d'emploi complet",
    excerpt: "Consultez votre notaire par vidéoconférence pour signer vos actes à distance. Matériel nécessaire, déroulement, valeur juridique et tarifs.",
    date: "2025-12-15",
    readingTime: 6,
    category: "Guide",
    keywords: ["rendez-vous notaire visio", "notaire visioconférence", "signature notaire distance", "acte notarié vidéo"],
    canonicalUrl: "https://notaires.io/blog/rdv-notaire-en-visio",
    faqs: [
      { question: "Quel matériel faut-il pour un rendez-vous notaire en visio ?", answer: "Un ordinateur, une tablette ou un smartphone avec une caméra fonctionnelle, une connexion internet stable et une pièce d'identité. Certaines études demandent aussi un scanner ou une imprimante pour les documents à transmettre." },
      { question: "Un rendez-vous notaire en visio coûte-t-il plus cher ?", answer: "Non, les émoluments réglementés sont identiques quel que soit le mode de réception (présentiel ou visio). Des frais techniques minimes peuvent parfois s'ajouter." }
    ]
  },
  {
    slug: "rdv-notaire-succession",
    title: "Rendez-vous notaire pour une succession : à quoi s'attendre ?",
    excerpt: "Premier rendez-vous après un décès : documents à apporter, étapes du règlement successoral, délais et honoraires. Tout ce qu'il faut savoir.",
    date: "2025-12-17",
    readingTime: 8,
    category: "Succession",
    keywords: ["rendez-vous notaire succession", "premier rdv notaire décès", "documents succession notaire", "règlement succession notaire"],
    canonicalUrl: "https://notaires.io/blog/rdv-notaire-succession",
    faqs: [
      { question: "Dans quel délai faut-il contacter un notaire après un décès ?", answer: "Idéalement dans les 2 à 4 semaines suivant le décès. La déclaration de succession doit être déposée dans les 6 mois si le défunt résidait en France métropolitaine." },
      { question: "Est-il obligatoire de passer par un notaire pour régler une succession ?", answer: "Le notaire est obligatoire si la succession comporte un bien immobilier, s'il existe un testament notarié ou si la valeur de la succession dépasse 5 000 €. Pour les petites successions mobilières, une simple attestation peut suffire." }
    ]
  },
  {
    slug: "rdv-notaire-achat-immobilier",
    title: "Rendez-vous notaire achat immobilier : les 3 étapes clés",
    excerpt: "Compromis, avant-contrat et acte de vente : chaque étape d'un achat immobilier nécessite une rencontre avec votre notaire. Guide des 3 rendez-vous essentiels.",
    date: "2025-12-19",
    readingTime: 7,
    category: "Immobilier",
    keywords: ["rendez-vous notaire achat immobilier", "notaire achat maison étapes", "signature acte vente notaire", "rdv notaire immobilier"],
    canonicalUrl: "https://notaires.io/blog/rdv-notaire-achat-immobilier",
    faqs: [
      { question: "Faut-il obligatoirement un notaire pour signer un compromis de vente ?", answer: "Non, le compromis peut être signé en agence ou entre particuliers. Mais signer un avant-contrat chez le notaire offre plus de sécurité (vérification des titres, conseils)." },
      { question: "Peut-on avoir un notaire différent du vendeur ?", answer: "Oui et c'est même recommandé. Les deux notaires partagent les émoluments sans surcoût pour vous, et chacun défend exclusivement les intérêts de son client." }
    ]
  },

  {
    slug: "rdv-notaire-mariage-pacs",
    title: "Rendez-vous notaire pour mariage et PACS : ce qu'il faut savoir",
    excerpt: "Contrat de mariage, régime matrimonial, PACS notarié : le notaire vous conseille et sécurise votre union. Guide complet pour préparer votre rendez-vous.",
    date: "2025-12-22",
    readingTime: 7,
    category: "Droit de la famille",
    keywords: ["rendez-vous notaire mariage", "rdv notaire PACS", "contrat mariage notaire", "notaire avant mariage"],
    canonicalUrl: "https://notaires.io/blog/rdv-notaire-mariage-pacs",
    faqs: [
      { question: "Est-il obligatoire de voir un notaire avant de se marier ?", answer: "Non, sauf si vous souhaitez opter pour un régime matrimonial différent de la communauté légale. Sans contrat de mariage, vous êtes automatiquement soumis à la communauté réduite aux acquêts." },
      { question: "Le PACS doit-il être signé chez un notaire ?", answer: "Depuis 2017, le PACS peut être enregistré en mairie. Mais le PACS notarié offre davantage de personnalisation patrimoniale et une sécurité juridique supérieure." }
    ]
  },
  {
    slug: "rdv-notaire-divorce",
    title: "Rendez-vous notaire pour un divorce : rôle et étapes",
    excerpt: "En cas de divorce par consentement mutuel, le notaire est obligatoire pour homologuer la convention. Comment se déroule ce rendez-vous ?",
    date: "2025-12-24",
    readingTime: 7,
    category: "Droit de la famille",
    keywords: ["rendez-vous notaire divorce", "notaire divorce consentement mutuel", "convention divorce notaire", "partage biens divorce notaire"],
    canonicalUrl: "https://notaires.io/blog/rdv-notaire-divorce",
    faqs: [
      { question: "Le notaire est-il obligatoire pour tous les divorces ?", answer: "Non, seulement pour le divorce par consentement mutuel sans juge (depuis 2017). Pour les divorces contentieux, c'est le juge aux affaires familiales qui statue, mais un notaire peut intervenir pour le partage des biens immobiliers." },
      { question: "Quel est le délai pour finaliser un divorce par consentement mutuel chez le notaire ?", answer: "Après la signature de la convention par les deux époux et leurs avocats, le notaire dispose d'un délai de 7 jours pour déposer la convention. La procédure complète dure généralement 2 à 4 mois." }
    ]
  },
  {
    slug: "rdv-notaire-donation",
    title: "Rendez-vous notaire pour une donation : guide pas à pas",
    excerpt: "Donation simple, donation-partage, donation avec réserve d'usufruit : préparez votre rendez-vous notarial pour transmettre votre patrimoine dans les meilleures conditions.",
    date: "2025-12-26",
    readingTime: 7,
    category: "Patrimoine",
    keywords: ["rendez-vous notaire donation", "rdv notaire donation immobilière", "préparer donation notaire", "donation partage notaire"],
    canonicalUrl: "https://notaires.io/blog/rdv-notaire-donation",
    faqs: [
      { question: "Combien de temps dure un rendez-vous notarié pour une donation ?", answer: "Pour une donation simple d'un bien immobilier, comptez 1 à 2 heures. Pour une donation-partage complexe impliquant plusieurs enfants et plusieurs biens, le processus peut s'étaler sur 2 à 3 rendez-vous." },
      { question: "Les deux parties doivent-elles être présentes chez le notaire pour une donation ?", answer: "En principe oui, sauf si une procuration authentique est établie pour l'une d'elles. Le donataire (celui qui reçoit) peut également être représenté." }
    ]
  },
  {
    slug: "consultation-notaire-prix",
    title: "Consultation notaire : quel est le prix en 2025 ?",
    excerpt: "Consultation juridique, bilan patrimonial, conseil en succession : combien coûte une heure chez le notaire ? Tarifs, pratiques et comment optimiser votre budget.",
    date: "2025-12-28",
    readingTime: 6,
    category: "Guide",
    keywords: ["consultation notaire prix", "tarif consultation notaire", "combien coûte notaire consultation", "honoraires consultation notaire 2025"],
    canonicalUrl: "https://notaires.io/blog/consultation-notaire-prix",
    faqs: [
      { question: "Quel est le tarif moyen d'une consultation d'une heure chez un notaire ?", answer: "Entre 150 et 400 € selon la région et la spécialité. En Île-de-France, comptez plutôt 200 à 350 € HT pour une heure de consultation patrimoniale ou successorale." },
      { question: "La consultation notariale est-elle déductible des impôts ?", answer: "Non, les honoraires de consultation notariale ne sont pas déductibles pour les particuliers. En revanche, ils peuvent l'être pour les professionnels si la consultation concerne leur activité." }
    ]
  },
  {
    slug: "notaire-sans-rendez-vous",
    title: "Notaire sans rendez-vous : est-ce possible ?",
    excerpt: "Peut-on se présenter chez un notaire sans rendez-vous préalable ? Permanences, consultations libres et accueil sans rendez-vous : ce que proposent les études en 2025.",
    date: "2025-12-30",
    readingTime: 5,
    category: "Guide",
    keywords: ["notaire sans rendez-vous", "notaire permanence sans rdv", "consultation notaire sans rdv", "accueil notaire spontané"],
    canonicalUrl: "https://notaires.io/blog/notaire-sans-rendez-vous",
    faqs: [
      { question: "Peut-on se présenter sans rendez-vous dans une étude notariale ?", answer: "Certaines études proposent des plages de permanences sans rendez-vous pour les questions simples. Mais pour un acte ou un conseil approfondi, un rendez-vous est toujours préférable." },
      { question: "Les maisons de justice proposent-elles des consultations notariales sans rendez-vous ?", answer: "Oui, de nombreuses maisons de justice et du droit (MJD) proposent des permanences de notaires bénévoles, souvent sans rendez-vous et gratuitement pour des questions simples." }
    ]
  },
  {
    slug: "notaire-rapide-delai",
    title: "Notaire rapide : quels délais peut-on espérer en pratique ?",
    excerpt: "Délai pour un rendez-vous, délai pour signer un acte, délai pour recevoir sa copie : les vrais délais notariaux et comment les raccourcir.",
    date: "2026-01-02",
    readingTime: 6,
    category: "Guide",
    keywords: ["notaire délai rapide", "délai rendez-vous notaire", "délai acte notarié", "notaire disponible rapidement"],
    canonicalUrl: "https://notaires.io/blog/notaire-rapide-delai",
    faqs: [
      { question: "Quel est le délai moyen pour obtenir un rendez-vous notarial ?", answer: "Pour une consultation simple, généralement 3 à 10 jours ouvrés. Pour la signature d'un acte de vente, le délai est dicté par les vérifications préalables et le financement (2 à 4 mois)." },
      { question: "Comment accélérer un dossier notarial ?", answer: "Fournissez tous les documents requis dès le premier contact, répondez rapidement aux demandes du clerc, évitez les périodes de congés scolaires, et précisez votre contrainte de délai dès le départ." }
    ]
  },
  {
    slug: "notaire-disponible-weekend",
    title: "Notaire disponible le week-end : comment trouver ?",
    excerpt: "Urgence un samedi ou un dimanche ? Certains notaires assurent des permanences le week-end. Voici comment trouver un notaire disponible hors des heures habituelles.",
    date: "2026-01-05",
    readingTime: 5,
    category: "Guide",
    keywords: ["notaire disponible week-end", "notaire samedi dimanche", "permanence notaire week-end", "notaire urgence week-end"],
    canonicalUrl: "https://notaires.io/blog/notaire-disponible-weekend",
    faqs: [
      { question: "Les notaires travaillent-ils le week-end ?", answer: "Pas habituellement. Certaines études ouvrent le samedi matin sur rendez-vous. Pour les urgences du dimanche, la chambre départementale des notaires peut orienter vers un notaire de garde." },
      { question: "Comment contacter un notaire de garde le week-end ?", answer: "Appelez la chambre des notaires de votre département — le numéro figure sur notaires.fr. En cas d'urgence absolue (personne mourante souhaitant tester), le procureur de la République peut aussi réquisitionner un notaire." }
    ]
  },
  {
    slug: "combien-temps-rdv-notaire",
    title: "Combien de temps dure un rendez-vous chez le notaire ?",
    excerpt: "De 20 minutes à plusieurs heures selon l'acte : durées types des rendez-vous notariaux et comment optimiser le temps passé chez le notaire.",
    date: "2026-01-07",
    readingTime: 5,
    category: "Guide",
    keywords: ["durée rendez-vous notaire", "combien de temps notaire", "temps signature acte notarié", "durée consultation notaire"],
    canonicalUrl: "https://notaires.io/blog/combien-temps-rdv-notaire",
    faqs: [
      { question: "Combien de temps dure une signature d'acte de vente immobilière ?", answer: "Généralement 1 à 2 heures selon la complexité. Le notaire lit l'acte intégralement (ou en résumé si les parties l'acceptent), répond aux questions et procède à la signature." },
      { question: "Peut-on réduire la durée d'un rendez-vous notarial ?", answer: "Oui : lisez l'acte en amont (le notaire peut vous l'envoyer par email), préparez vos questions, et demandez si la lecture résumée est possible. Cela peut réduire le temps de 30 à 50 %." }
    ]
  },
  {
    slug: "notaire-urgence-succession",
    title: "Notaire urgence succession : que faire dans les premières 48 heures ?",
    excerpt: "Décès soudain, succession complexe, délais fiscaux qui courent : comment trouver un notaire en urgence pour une succession et quelles sont les premières démarches.",
    date: "2026-01-09",
    readingTime: 7,
    category: "Succession",
    keywords: ["notaire urgence succession", "succession urgente notaire", "notaire décès urgent", "premières démarches succession"],
    canonicalUrl: "https://notaires.io/blog/notaire-urgence-succession",
    faqs: [
      { question: "Faut-il contacter le notaire immédiatement après un décès ?", answer: "Pas nécessairement dans les premières 24 heures. Les premières démarches (déclaration de décès en mairie, pompes funèbres) sont prioritaires. Le notaire peut généralement être contacté dans la première semaine." },
      { question: "Y a-t-il des actes urgents à faire chez le notaire après un décès ?", answer: "Si le défunt avait des affaires urgentes (vente en cours, entreprise à gérer, loyer impayé imminent), le notaire peut établir rapidement un acte de notoriété permettant aux héritiers d'agir." }
    ]
  },
  {
    slug: "notaire-urgence-achat",
    title: "Notaire urgence achat immobilier : comment accélérer la transaction ?",
    excerpt: "Vendeur pressé, délai de validité d'un crédit expirant, vente aux enchères : comment mobiliser un notaire en urgence pour une acquisition immobilière rapide.",
    date: "2026-01-12",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["notaire urgence achat immobilier", "achat immobilier rapide notaire", "accélérer signature notaire", "délai court achat notarié"],
    canonicalUrl: "https://notaires.io/blog/notaire-urgence-achat",
    faqs: [
      { question: "Quel est le délai minimum pour un achat immobilier en urgence ?", answer: "Avec un achat comptant (sans prêt), le délai minimum est d'environ 3 semaines (droit de rétractation 10 jours + vérifications minimales). Avec un prêt, il est difficile de descendre sous 6 à 8 semaines." },
      { question: "Le notaire peut-il être tenu responsable si l'acte n'est pas signé dans les délais ?", answer: "Le notaire n'est pas responsable des délais administratifs (réponse du cadastre, purge du droit de préemption). En revanche, si un retard est dû à une négligence de l'étude, sa responsabilité professionnelle peut être engagée." }
    ]
  },

];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
