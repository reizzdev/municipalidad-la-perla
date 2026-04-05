import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AutoridadesPage() {
  return (
    <>
      <TopBar />
      <Header />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Autoridades" }]} />
        <div className="container-main py-12">
          <h1 className="text-3xl font-bold text-[#1a3a5c] mb-6">Autoridades</h1>
          <p className="text-[#6b7a8d] text-lg leading-relaxed">
            Conoce a las autoridades que conforman la gestion municipal del Distrito de La Perla:
            el Alcalde, los Regidores y los funcionarios de la administracion publica distrital.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
