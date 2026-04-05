import Image from "next/image";

const phones = [
  { label: "Matrimonio Civil", number: "(01) 754 4000 Anexo 101" },
  { label: "Estado de tu Tramite", number: "(01) 754 4000 Anexo 102" },
  { label: "Certificado ITSE (Defensa Civil)", number: "(01) 754 4000 Anexo 103" },
  { label: "Certificado Hab. Urbanas", number: "(01) 754 4000 Anexo 104" },
  { label: "Tributos Municipales", number: "(01) 754 4000 Anexo 105" },
  { label: "Padron de Adultos Mayores", number: "(01) 754 4000 Anexo 106" },
];

export default function ContactSection() {
  return (
    <section id="contacto" className="bg-[#02324F] pt-16 md:pt-12 pb-10">
      <div className="container-main pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {/* CONTACTO */}
          <div className="mx-auto">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Tramites y<br />Contacto
            </h2>
            <div className="w-50 h-1 bg-[#3dbfb8] rounded-full mt-2 mb-4" />
            <p className="text-white/60 text-sm leading-relaxed">
              Comunicate con el area que necesitas.
            </p>
          </div>

          {/* LISTA DE TELEFONOS */}
          <div className="flex flex-col gap-3 mx-auto">
            {phones.map((item) => (
              <a
                key={item.label}
                href={`tel:${item.number.replace(/\D/g, "")}`}
                className="flex items-center gap-3 group"
              >
                
                <div className="invert">{"➤"}</div>
                <div>
                  <p className="text-white/90 text-sm font-bold group-hover:text-[#3dbfb8] transition-colors">
                    {item.label}
                  </p>
                  <p className="text-white/50 text-xs">{item.number}</p>
                </div>
              </a>
            ))}
          </div>

          {/* LOGO DE CONTACTO */}
          <div className="flex items-center justify-center mx-auto">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/images/logoMunicipalidadContacto.png"
                alt="Municipalidad de La Perla"
                width={220}
                height={220}
                className="object-contain brightness-0 invert opacity-80"
              />
              <p className="text-white/40 text-xs text-center uppercase tracking-widest font-bold">
                Municipalidad<br />de La Perla
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
