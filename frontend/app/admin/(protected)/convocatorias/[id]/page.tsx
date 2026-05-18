'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Pencil } from 'lucide-react';

type Documento = {
  id: string;
  section: string;
  fileName: string;
  fileMimeType: string;
  fileSize: number;
  createdAt: string;
};

type ConvocatoriaItem = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  documentos: Documento[];
};

const SECTIONS = [
  'BASES',
  'ANEXOS',
  'COMUNICADOS',
  'FE DE ERRATAS',
  'RESULTANTE CURRICULAR',
  'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS',
  'PUBLICACION FINAL',
] as const;

function formatDateEs(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ConvocatoriaDetallePage() {
  const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [item, setItem] = useState<ConvocatoriaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    fetch(`http://localhost:4000/api/convocatorias/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('No encontrada');
        return res.json();
      })
      .then((data) => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  function downloadFile(file: Documento) {
    const link = document.createElement('a');
    link.href = `http://localhost:4000/api/convocatorias/documentos/${file.id}/download`;
    link.download = file.fileName || 'archivo.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

function normalize(text: string) {
  return text
    .normalize("NFKC")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/\u00A0/g, " ") // quita NBSP invisible
    .replace(/\t/g, " ") // quita tabs
    .replace(/\n/g, " ") // quita saltos de línea
    .replace(/\s+/g, " ") // colapsa espacios
    .trim()
    .toUpperCase();
}


function getDocumentosBySection(section: string) {
  return (
    item?.documentos?.filter(
      (doc) =>
        normalize(doc.section) === normalize(section)
    ) || []
  );
}

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-main py-16 text-center text-slate-500">
          Cargando convocatoria...
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-main py-16 text-center text-slate-500">
          Convocatoria no encontrada.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container-main py-10">

        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            Municipalidad Distrital de La Perla
          </Link>

          <Link
            href={`/admin/convocatorias/${item.id}/editar`}
            className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm text-white hover:bg-blue-700 transition"
          >
            <Pencil size={16} />
            Editar convocatoria
          </Link>
        </div>

        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900">{item.title}</h1>

          <p className="mt-2 text-sm text-gray-700">
            {item.description}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            {formatDateEs(item.publishedAt)}
          </p>
        </div>

        {/* TABLA SIN ACCIÓN */}
        <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Sección
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Documentos
                </th>
                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Cantidad
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-sm">
              {SECTIONS.map((section) => {
                const files = getDocumentosBySection(section);

                return (
                  <tr key={section} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {section}
                    </td>

                    <td className="px-5 py-4">
                      {files.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {files.map((file) => (
                            <button
                              key={file.id}
                              type="button"
                              onClick={() => downloadFile(file)}
                              title={file.fileName}
                              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                              <img
                                src="/images/pdf.png"
                                alt="PDF"
                                className="h-4 w-4 object-contain"
                              />
                              <span className="max-w-[320px] truncate">
                                {file.fileName}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">
                          Sin documentos
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {files.length}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}