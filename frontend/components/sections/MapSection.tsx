import { MapPin, Clock, Phone } from "lucide-react";

export default function MapSection() {
  return (
    <section className="py-10 overflow-hidden relative z-10">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1fr_1.4fr] gap-10 items-start ">
          {/* UBICANOS */}
          <div className="flex flex-col justify-start ">
            <h2 className="text-3xl font-extrabold text-[#1a3a5c] leading-tight">
              Ubicanos
            </h2>
            <div className="w-35 h-1 bg-[#3dbfb8] rounded-full mt-2 mb-4" />
            <p className="text-[#6b7a8d] text-sm leading-relaxed">
              Visitanos en nuestra sede principal. Estamos disponibles para atenderte
              en los horarios indicados.
            </p>
          </div>

          {/* Col 2: Info */}
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e8f8f7] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#0F7A96]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F7A96] uppercase tracking-wider mb-0.5">Sede</p>
                <p className="text-sm font-semibold text-[#3B5373]">
                  José Pardo 598,<br />La Perla, Callao
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e8f8f7] flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#0F7A96]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F7A96] uppercase tracking-wider mb-0.5">
                  Horario de Atencion
                </p>
                <p className="text-sm font-semibold text-[#3B5373]">
                  Lunes a viernes: 8:10 a.m. - 5:20 p.m.<br />
                  Sabados: 8:10 a.m. - 1:00 p.m.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e8f8f7] flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-[#0F7A96]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F7A96] uppercase tracking-wider mb-0.5">
                  Central Telefonica
                </p>
                <p className="text-sm font-semibold text-[#3B5373]">(01) 420 5604</p>
              </div>
            </div>
          </div>

          {/* Col 3: Map - slightly overflows bottom into ContactSection */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7803.37855722246!2d-77.10868284438662!3d-12.064887040488053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cbe0b445c091%3A0x86eadcac0bad7a4c!2sMunicipalidad%20de%20La%20Perla!5e0!3m2!1ses!2spe!4v1775403400337!5m2!1ses!2spe"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicacion Municipalidad de La Perla"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
