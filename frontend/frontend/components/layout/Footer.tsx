import SocialLinks from "@/components/ui/SocialLinks";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1D4F7D] border-t border-white/10">
      <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/70 text-xs">
          &copy; {year} Municipalidad de La Perla — Pagina principal
        </p>

        <SocialLinks />

        <p className="text-white/70 text-xs">
          Desarrollado por{" "}
          <span className="text-[#3dbfb8] font-semibold">Kevin Anthony Chocca Casapino & Cesar</span>
        </p>
      </div>
    </footer>
  );
}

