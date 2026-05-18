import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import NewsBox from "@/components/sections/NewsBox";
import ServicesGrid from "@/components/sections/ServicesGrid";
import NewsSection from "@/components/sections/NewsSection";
import MapSection from "@/components/sections/MapSection";
import ContactSection from "@/components/sections/ContactSection";
import HighlightSection from "@/components/sections/alcaldeSection";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Header />
      <Navbar />

      <main>
        <HeroSection />
        <NewsBox />

        <HighlightSection />

        <ServicesGrid />
        <NewsSection />

         <div className="z-0">
        <MapSection />
        </div>
           <div className="-mt-22 z-0">
        <ContactSection />
        </div>

      </main>

      <Footer />
    </>
  );
}