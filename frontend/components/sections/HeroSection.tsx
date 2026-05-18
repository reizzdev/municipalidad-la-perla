"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type HeroImage = {
  id: string;
  imageUrl: string;
  altText: string;
  section: string;
};

const defaultImage: HeroImage = {
  id: "default",
  imageUrl: "/images/default.jpg",
  altText: "Imagen por defecto",
  section: "hero",
};

export default function HeroSection() {
  const [images, setImages] = useState<HeroImage[]>([defaultImage]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api
      .get("api/website-images/hero")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setImages(res.data);
        }
      })
      .catch(() => {
        // Si falla la API, se mantiene la imagen por defecto
        setImages([defaultImage]);
      });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="relative w-full h-56 sm:h-72 md:h-132 overflow-hidden bg-black">
      {images.map((img, index) => (
        <img
          key={img.id}
          src={img.imageUrl}
          alt={img.altText}
          data-section={img.section}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/default.jpg";
          }}
          className={`object-cover absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a5c]/30 via-transparent to-[#1a3a5c]/50" />

      {/* Flecha izquierda */}
      {images.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 
                     bg-black/40 hover:bg-black/60 text-white 
                     rounded-full w-10 h-10 flex items-center justify-center 
                     backdrop-blur-sm transition"
        >
          ‹
        </button>
      )}

      {/* Flecha derecha */}
      {images.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 
                     bg-black/40 hover:bg-black/60 text-white 
                     rounded-full w-10 h-10 flex items-center justify-center 
                     backdrop-blur-sm transition"
        >
          ›
        </button>
      )}
    </section>
  );
}