import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1D4F7D] border-t border-white/10">
      <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/70 text-xs">
          &copy; {year} Municipalidad de La Perla — Pagina principal
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          <a href="#" aria-label="Facebook" className="text-white/70 hover:text-[#3dbfb8] transition-colors">
            <Facebook size={20} />
          </a>
          <a href="#" aria-label="Twitter / X" className="text-white/70 hover:text-[#3dbfb8] transition-colors">
            <Twitter size={20} />
          </a>
          <a href="#" aria-label="Instagram" className="text-white/70 hover:text-[#3dbfb8] transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" aria-label="YouTube" className="text-white/70 hover:text-[#3dbfb8] transition-colors">
            <Youtube size={20} />
          </a>
        </div>

        <p className="text-white/70 text-xs">
          Desarrollado por{" "}
          <span className="text-[#3dbfb8] font-semibold">Kevin Anthony Ch.</span>
        </p>
      </div>
    </footer>
  );
}
