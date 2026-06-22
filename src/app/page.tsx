import { DemoSection } from "@/components/DemoSection";
import { DeveloperSection } from "@/components/DeveloperSection";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { SDK } from "@/components/SDK";
import { GridBackground } from "@/components/site/GridBackground";

export default function Home() {
  return (
    <>
      <GridBackground />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <DemoSection />
        <DeveloperSection />
        <SDK />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
