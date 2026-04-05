import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 py-3">
      <div className="container-main flex items-center justify-between">
        
        {/* LOGO DE LA MUNICIPALIDAD DE LA PERLA */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logoMunicipalidad.png"
            alt="Municipalidad de La Perla"
            width={64}
            height={64}
            className="object-contain"
          />
          <div className="leading-tight">
            <p className="text-xs text-[#6b7a8d] font-semibold uppercase tracking-widest">
              Municipalidad de
            </p>
            <p className="text-2xl font-extrabold text-[#1a3a5c] leading-none">
              La Perla
            </p>
          </div>
        </Link>

        {/* LOGO DE GOB.PE Y PORTAL DE TRANSPARENCIA */}
        <div className="flex items-center gap-4">
          <Image
            src="/images/logoGobPe.png"
            alt="gob.pe"
            width={100}
            height={40}
            className="object-contain"
          />
          <Image
            src="/images/logoTransparencia.png"
            alt="Portal de Transparencia"
            width={100}
            height={40}
            className="object-contain"
          />
        </div>
      </div>
    </header>
  );
}
