import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container-main py-3">
        <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <span key={item.label} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-[#3dbfb8] font-semibold hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-[#1a3a5c] font-bold" : "text-[#6b7a8d]"}>
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
