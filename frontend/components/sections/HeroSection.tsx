import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-56 sm:h-72 md:h-96 overflow-hidden">
      <Image
        src="/images/heroBanner.jpg"
        alt="Distrito de La Perla"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a5c]/30 via-transparent to-[#1a3a5c]/50" />
    </section>
  );
}
