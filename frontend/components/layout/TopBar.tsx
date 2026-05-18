"use client";

import { Mail, FileText, User } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#1B4266] text-white text-sm">
      <div className="container-main flex items-center gap-6 py-1.5">
        <a href="http://localhost:3000/admin" 
        target="_blank"
          rel="noopener noreferrer"
        className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-semibold">
          <User size={15} />
          <span>Admin</span>
        </a>
        <span className="text-white/30">|</span>
        <a href="http://localhost:3000/convocatorias" 
        target="_blank"
          rel="noopener noreferrer"
        className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-semibold">
          <FileText size={16} />
          <span>Convocatorias</span>
        </a>
      </div>
    </div>
  );
}
