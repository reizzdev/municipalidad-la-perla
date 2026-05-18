"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type ImageType = {
  id: string;
  imageUrl: string;
  altText: string;
  section: string;
};

type Tab = "hero" | "newbox" | "alcalde";

export default function AdminFotosPage() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [tab, setTab] = useState<Tab>("hero");

  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");

  async function loadImages() {
    const [heroRes, newboxRes, alcaldeRes] = await Promise.all([
      api.get("api/website-images/hero"),
      api.get("api/website-images/newbox"),
      api.get("api/website-images/alcalde"),
    ]);

    setImages([...heroRes.data, ...newboxRes.data, ...alcaldeRes.data]);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    await api.post("api/website-images", {
      section: tab, // 🔥 automático según tab
      imageUrl,
      altText,
    });

    setImageUrl("");
    setAltText("");
    loadImages();
  }

  async function handleDelete(id: string) {
    await api.delete(`api/website-images/${id}`);
    loadImages();
  }

  const filtered = images.filter((img) => img.section === tab);

  return (
    <div className="space-y-8">

      {/* HEADER */}
       <div className="mb-10 flex items-center justify-between">
       <div className="flex items-center gap-5">
            <h1 className="text-3xl font-bold text-[#0b2b4c]">
              Gestor de Imagenes
            </h1>
            <div className="hidden md:block w-40 h-[2px] bg-gradient-to-r from-[#3dbfb8] to-transparent" />
          </div>
</div>
      {/* TABS */}
      <div className="flex gap-2">
        <TabButton active={tab === "hero"} onClick={() => setTab("hero")}>
          Imagenes de carrusel
        </TabButton>

        <TabButton active={tab === "newbox"} onClick={() => setTab("newbox")}>
          Imagen central
        </TabButton>

        <TabButton active={tab === "alcalde"} onClick={() => setTab("alcalde")}>
          Imagen del alcalde
        </TabButton>
      </div>

      {/* UPLOAD BAR (tipo pro) */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="URL de imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <input
          type="text"
          placeholder="Descripción"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Subir
        </button>
      </form>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={img.imageUrl}
              className="h-44 w-full object-cover"
            />

            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-500 uppercase">
                {img.section}
              </p>

              <p className="font-medium text-sm">
                {img.altText}
              </p>

              <button
                onClick={() => handleDelete(img.id)}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTES ---------------- */

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${
          active
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
    >
      {children}
    </button>
  );
}