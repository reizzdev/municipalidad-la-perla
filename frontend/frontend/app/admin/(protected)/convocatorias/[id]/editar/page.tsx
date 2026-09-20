'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

const CONVOCATORIA_SECTIONS = [
  'BASES',
  'ANEXOS',
  'COMUNICADOS',
  'FE DE ERRATAS',
  'RESULTANTE CURRICULAR',
  'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS',
  'PUBLICACION FINAL',
] as const;

type ConvocatoriaSection = typeof CONVOCATORIA_SECTIONS[number];

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

type FileFields = Record<ConvocatoriaSection, File[]>;

function formatBytes(bytes?: number) {
  if (!bytes) return '--';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${Math.round(bytes / 1024)} KB`;
  return `${mb.toFixed(1)} MB`;
}

export default function EditarConvocatoriaPage() {
  const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [item, setItem] = useState<ConvocatoriaItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [files, setFiles] = useState<FileFields>({
    BASES: [],
    ANEXOS: [],
    COMUNICADOS: [],
    'FE DE ERRATAS': [],
    'RESULTANTE CURRICULAR': [],
    'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS': [],
    'PUBLICACION FINAL': [],
  });

  const fileRefs: Record<
    ConvocatoriaSection,
    React.RefObject<HTMLInputElement | null>
  > = {
    BASES: useRef<HTMLInputElement>(null),
    ANEXOS: useRef<HTMLInputElement>(null),
    COMUNICADOS: useRef<HTMLInputElement>(null),
    'FE DE ERRATAS': useRef<HTMLInputElement>(null),
    'RESULTANTE CURRICULAR': useRef<HTMLInputElement>(null),
    'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS':
      useRef<HTMLInputElement>(null),
    'PUBLICACION FINAL': useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    fetch(`http://localhost:4000/api/convocatorias/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar la convocatoria');
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setTitle(data.title ?? '');
        setDescription(data.description ?? '');
      })
      .catch((error) => {
        console.error(error);
        setItem(null);
      });
  }, [params.id]);

  function getDocumentos(section: ConvocatoriaSection) {
    return item?.documentos?.filter((d) => d.section === section) || [];
  }

  function openFilePicker(section: ConvocatoriaSection) {
    fileRefs[section].current?.click();
  }

  function handleFileChange(
    section: ConvocatoriaSection,
    selectedFiles: FileList | null
  ) {
    if (!selectedFiles) return;

    const pdfFiles = Array.from(selectedFiles).filter(
      (file) => file.type === 'application/pdf'
    );

    if (pdfFiles.length === 0) {
      alert('Solo se permiten archivos PDF');
      return;
    }

    if (section === 'ANEXOS') {
      setFiles((prev) => ({
        ...prev,
        ANEXOS: [...prev.ANEXOS, ...pdfFiles],
      }));
    } else {
      setFiles((prev) => ({
        ...prev,
        [section]: pdfFiles.slice(0, 1),
      }));
    }

    if (fileRefs[section].current) {
      fileRefs[section].current!.value = '';
    }
  }

  function removeNewFile(section: ConvocatoriaSection, index: number) {
    setFiles((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }

  function clearNewFiles(section: ConvocatoriaSection) {
    setFiles((prev) => ({ ...prev, [section]: [] }));

    if (fileRefs[section].current) {
      fileRefs[section].current!.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!item) return;

    try {
      setSaving(true);
      setMessage('');

      const { token } = getSession();

      if (!token) {
        setMessage('Tu sesión expiró. Vuelve a iniciar sesión.');
        setSaving(false);
        return;
      }

      const res = await fetch(
        `http://localhost:4000/api/convocatorias/${item.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'No se pudo actualizar la convocatoria');
      }

      const formData = new FormData();
      let index = 0;

      for (const section of CONVOCATORIA_SECTIONS) {
        for (const file of files[section]) {
          const name = `file_${index}`;
          formData.append(name, file);
          formData.append(`section_${name}`, section);
          index++;
        }
      }

      if (index > 0) {
        const uploadRes = await fetch(
          `http://localhost:4000/api/convocatorias/${item.id}/documentos`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          throw new Error(text || 'No se pudieron subir los documentos');
        }
      }

      router.push(`/admin/convocatorias/${item.id}`);
    } catch (err) {
      console.error(err);
      setMessage(
        err instanceof Error ? err.message : 'No se pudo guardar los cambios'
      );
    } finally {
      setSaving(false);
    }
  }

  if (!item) return <div>Convocatoria no encontrada</div>;

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200"
      >
        <div className="border-b border-slate-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Editar convocatoria
          </h1>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Título
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-3 rounded-xl min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {CONVOCATORIA_SECTIONS.map((section) => {
              const currentFiles = getDocumentos(section);
              const newFiles = files[section];
              const isAnexos = section === 'ANEXOS';

              return (
                <div
                  key={section}
                  className="border p-4 rounded-xl bg-slate-50"
                >
                  <p className="font-semibold">{section}</p>

                  <div className="mt-2 text-sm text-gray-500">
                    <p className="font-medium">Actual:</p>

                    {currentFiles.length === 0 ? (
                      <p>Sin archivo</p>
                    ) : (
                      <ul className="list-disc ml-5">
                        {currentFiles.map((doc) => (
                          <li key={doc.id}>
                            {doc.fileName} ({formatBytes(doc.fileSize)})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileRefs[section]}
                    className="hidden"
                    accept="application/pdf"
                    multiple={isAnexos}
                    onChange={(e) =>
                      handleFileChange(section, e.target.files)
                    }
                  />

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => openFilePicker(section)}
                      className="bg-slate-800 text-white px-3 py-1 rounded"
                    >
                      {isAnexos ? 'Agregar PDFs' : 'Cambiar PDF'}
                    </button>

                    {newFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => clearNewFiles(section)}
                        className="border border-red-400 text-red-500 px-3 py-1 rounded"
                      >
                        Quitar nuevos
                      </button>
                    )}
                  </div>

                  {newFiles.length > 0 && (
                    <div className="mt-3 text-xs">
                      <p className="font-semibold mb-1">Nuevos:</p>

                      <ul className="space-y-1">
                        {newFiles.map((file, index) => (
                          <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-2 bg-white border px-2 py-1 rounded"
                          >
                            <span>
                              {file.name} ({formatBytes(file.size)})
                            </span>

                            <button
                              type="button"
                              onClick={() => removeNewFile(section, index)}
                              className="text-red-500 font-semibold"
                            >
                              X
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isAnexos && (
                    <p className="text-xs text-blue-600 mt-2">
                      En ANEXOS puedes agregar varios archivos PDF.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {message && (
            <div className="bg-red-100 text-red-600 p-3 rounded whitespace-pre-wrap">
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="border px-4 py-2 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
