"use client";

import { Mail, FileText } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#1B4266] text-white text-sm">
      <div className="container-main flex items-center gap-6 py-1.5">
        <a href="#" className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-semibold">
          <Mail size={16} />
          <span>Buzon Electronico</span>
        </a>
        <span className="text-white/30">|</span>
        <a href="#" className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-semibold">
          <FileText size={16} />
          <span>Mesa de Partes</span>
        </a>
      </div>
    </div>
  );
}
