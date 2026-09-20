"use client";

import { Mail, FileText, User } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-[#1B4266] text-white text-sm">
      <div className="container-main flex items-center gap-6 py-1.5">
        <Link href="/admin"
        className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-semibold">
          <User size={15} />
          <span>Admin</span>
        </Link>
        <span className="text-white/30">|</span>
        <Link href="/convocatorias"
        className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-semibold">
          <FileText size={16} />
          <span>Convocatorias</span>
        </Link>
      </div>
    </div>
  );
}
