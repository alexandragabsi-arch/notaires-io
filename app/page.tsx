import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import QRCard from "@/components/QRCard";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <QRCard />
      </main>
      <Footer />
    </>
  );
}
