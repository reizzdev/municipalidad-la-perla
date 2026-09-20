import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-gray-100 py-3 overflow-hidden">
      <div className="container-main flex items-center justify-between gap-2">

        {/* LOGO DE LA MUNICIPALIDAD DE LA PERLA */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/images/logoMunicipalidad.png"
            alt="Municipalidad de La Perla"
            width={64}
            height={64}
            className="object-contain w-12 h-12 sm:w-16 sm:h-16"
          />
          <div className="leading-tight">
            <p className="text-xs text-[#6b7a8d] font-semibold uppercase tracking-widest">
              Municipalidad de
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#1a3a5c] leading-none">
              La Perla
            </p>
          </div>
        </Link>

        {/* LOGOS GUBERNAMENTALES */}

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link href="https://www.gob.pe/munilaperla">
          <Image
            src="/images/logoGobPe.png"
            alt="gob.pe"
            width={80}
            height={36}
            className="object-contain max-w-[70px] sm:max-w-[100px] h-auto"
          />
          </Link>

          |

          <Link href="https://www.transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=10940">
          <Image
            src="/images/logoTransparencia.png"
            alt="Portal de Transparencia"
            width={100}
            height={40}
            className="object-contain max-w-[72px] sm:max-w-[100px] h-auto"
          />
          </Link>
        </div>

      </div>
    </header>
  );
}