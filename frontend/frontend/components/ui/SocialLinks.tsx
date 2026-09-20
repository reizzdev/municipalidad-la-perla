import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

type Props = {
  className?: string;
  iconSize?: number;
  variant?: "light" | "dark";
};

export default function SocialLinks({
  className = "",
  iconSize = 18,
  variant = "dark",
}: Props) {
  const isDark = variant === "dark";

  const baseStyles =
    "p-2 rounded-full cursor-pointer transition-all duration-200";

  const colorStyles = isDark
    ? "bg-[#1D4F7D]/50 text-white hover:bg-[#1B4266] hover:text-white"
    : "bg-[#1D4F7D] text-white hover:bg-[#1B4266] hover:text-white";

  const linkClass = `${baseStyles} ${colorStyles}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href="https://www.facebook.com/MunicipalidaddeLaPerla"
        aria-label="Facebook"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <Facebook size={iconSize} />
      </a>

      <a
        href="https://x.com/MuniLaPerla"
        aria-label="Twitter / X"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <Twitter size={iconSize} />
      </a>

      <a
        href="https://www.instagram.com/munilaperla/"
        aria-label="Instagram"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <Instagram size={iconSize} />
      </a>

      <a
        href="https://www.youtube.com/@municipalidaddelaperla3321"
        aria-label="YouTube"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <Youtube size={iconSize} />
      </a>
    </div>
  );
}