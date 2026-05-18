import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ContactSection from "@/components/sections/ContactSection";

export default function CiudadPage() {
  return (
    <>
      <TopBar />
      <Header />
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-4">
        <Breadcrumb
          items={[{ label: "Inicio", href: "/" }, { label: "Ciudad" }]}
        />

        <div className="container-main py-12 space-y-20">

          {/* BLOQUE PRINCIPAL + IMAGEN 1 */}
          <section className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1a3a5c] leading-tight mb-6">
                La Perla no es solo un distrito. <br />
                Es comunidad, historia y progreso.
              </h1>

              <p className="text-[#6b7a8d] text-lg leading-relaxed">
                Ubicada en el corazón del Callao, La Perla ha construido una
                identidad basada en el esfuerzo colectivo, el desarrollo urbano
                sostenido y una fuerte conexión entre vecinos.
              </p>
            </div>

            <div className="relative">
              <img
                src="/images/ciudad1.jpg"
                alt="Ciudad 1"
                className="w-full h-[340px] object-cover shadow-lg"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-3 shadow-md text-sm text-[#1a3a5c]">
                Vista urbana de La Perla
              </div>
            </div>
          </section>

          {/* BLOQUES DESORDENADOS */}
          <section className="grid md:grid-cols-2 gap-10 items-start">

            <div className="bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold text-[#1a3a5c] mb-3">
                Espacios públicos renovados
              </h2>
              <p className="text-[#6b7a8d] leading-relaxed">
                Parques mejorados, áreas verdes recuperadas y espacios pensados
                para las familias.
              </p>
            </div>

            <div className="bg-[#1a3a5c] text-white p-8 shadow-lg -mt-6">
              <h2 className="text-2xl font-bold mb-4">
                Seguridad ciudadana activa
              </h2>
              <p className="leading-relaxed text-gray-200">
                Patrullaje constante, tecnología aplicada y coordinación con los
                vecinos.
              </p>
            </div>

            {/* IMAGEN 2 DESORDENADA */}
            <div className="md:col-span-2 grid md:grid-cols-2 gap-6 items-center">
              <img
                src="/images/ciudad2.jpg"
                alt="Ciudad 2"
                className="w-full object-cover shadow-md"
              />

              <div className="bg-gray-100 p-8">
                <h2 className="text-lg font-bold text-[#1a3a5c] mb-2 uppercase tracking-wide">
                  Cultura y comunidad
                </h2>
                <p className="text-[#6b7a8d]">
                  Actividades culturales, talleres y eventos que fortalecen la
                  identidad local y promueven la participación vecinal.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 border-l-4 border-[#1a3a5c]">
              <h2 className="text-xl font-semibold text-[#1a3a5c] mb-3">
                Desarrollo urbano ordenado
              </h2>
              <p className="text-[#6b7a8d]">
                Obras que transforman pistas, veredas y espacios públicos,
                elevando la calidad de vida.
              </p>
            </div>

          </section>

          {/* FRASE */}
          <section className="max-w-2xl">
            <blockquote className="text-2xl text-[#1a3a5c] font-medium leading-snug">
              “Una ciudad avanza cuando su gente confía en ella.”
            </blockquote>
          </section>

          {/* BLOQUE FINAL + IMAGEN 3 */}
          <section className="grid md:grid-cols-3 gap-6 items-stretch">

            <div className="col-span-2 bg-[#f1f5f9] p-8">
              <h3 className="text-xl font-bold text-[#1a3a5c] mb-4">
                Gestión cercana
              </h3>
              <p className="text-[#6b7a8d] leading-relaxed">
                La municipalidad trabaja con un enfoque directo: escuchar,
                responder y actuar. Cada proyecto nace de una necesidad real
                del vecino.
              </p>
            </div>

            <div className="bg-[#1a3a5c] text-white p-6 flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-2">
                Visión a futuro
              </h3>
              <p className="text-gray-200 text-sm">
                La Perla continúa proyectándose como un distrito moderno,
                ordenado y sostenible.
              </p>
            </div>

            {/* IMAGEN 3 FULL WIDTH DESORDENADA */}
            <div className="md:col-span-3">
              <img
                src="/images/ciudad3.png"
                alt="Ciudad 3"
                className="w-full h-[340px] object-cover shadow-lg"
              />
            </div>

          </section>

        </div>
      </main>

      <ContactSection />
      <Footer />
    </>
  );
}