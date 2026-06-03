import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const faqParticuliers = [
  {
    q: "Combien ça coûte ?",
    a: "Le premier rendez-vous est offert, limité à 30 minutes. C'est suffisant pour poser vos questions, comprendre votre situation et décider de la suite. Si un acte notarié est nécessaire, vous réglez ensuite les honoraires directement au notaire — comme dans n'importe quelle étude, selon le tarif réglementé.",
  },
  {
    q: "Comment ça marche concrètement ?",
    a: "Vous décrivez votre besoin en quelques clics, on vous oriente vers un notaire compétent sur votre sujet, puis vous choisissez le créneau qui vous convient. Vous recevez votre confirmation et, si c'est en visio, votre lien de connexion.",
  },
  {
    q: "Le rendez-vous se passe en visio ou au cabinet ?",
    a: "Les deux sont possibles, selon le notaire et votre préférence. La visioconférence vous permet d'être reçu à distance, comme au cabinet, sans vous déplacer.",
  },
  {
    q: "Dois-je préparer des documents à l'avance ?",
    a: "On vous indique en amont les informations utiles à votre dossier, pour que le rendez-vous soit efficace et que vous repartiez avec des réponses claires.",
  },
  {
    q: "Puis-je annuler ou reporter mon rendez-vous ?",
    a: "Oui. Vous pouvez gérer votre rendez-vous depuis votre confirmation. En cas d'imprévu, prévenez simplement le plus tôt possible.",
  },
  {
    q: "Mes données personnelles sont-elles protégées ?",
    a: "Oui. Vos informations sont confidentielles et traitées conformément au RGPD. Elles ne servent qu'à préparer votre rendez-vous avec votre notaire.",
  },
];

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FAQ
          eyebrow="Questions fréquentes"
          title="Vous vous posez peut-être ces questions."
          items={faqParticuliers}
        />
      </main>
      <Footer />
    </>
  );
}
