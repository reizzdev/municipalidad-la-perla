import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CiudadPage() {
  return (
    <>
      <TopBar />
      <Header />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Ciudad" }]} />
        <div className="container-main py-12">
          <h1 className="text-3xl font-bold text-[#1a3a5c] mb-6">Ciudad</h1>
          <p className="text-[#6b7a8d] text-lg leading-relaxed">
            Conoce todo sobre el Distrito de La Perla: su historia, geografia, poblacion y
            desarrollo urbano. La Perla es un distrito de la Provincia Constitucional del
            Callao con una rica tradicion y una comunidad comprometida con su crecimiento.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
