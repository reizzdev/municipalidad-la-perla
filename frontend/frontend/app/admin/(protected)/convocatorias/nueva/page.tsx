'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

type FileFields = {
  BASES: File | null;
  ANEXOS: File[];
  COMUNICADOS: File | null;
  'FE DE ERRATAS': File | null;
  'RESULTANTE CURRICULAR': File | null;
  'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS': File | null;
  'PUBLICACION FINAL': File | null;
};

export default function NuevaConvocatoriaPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // formato YYYY-MM-DD
};

const [date, setDate] = useState(getToday());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [files, setFiles] = useState<FileFields>({
    BASES: null,
    ANEXOS: [],
    COMUNICADOS: null,
    'FE DE ERRATAS': null,
    'RESULTANTE CURRICULAR': null,
    'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS': null,
    'PUBLICACION FINAL': null,
  });

  const fileRefs = {
    BASES: useRef<HTMLInputElement>(null),
    ANEXOS: useRef<HTMLInputElement>(null),
    COMUNICADOS: useRef<HTMLInputElement>(null),
    'FE DE ERRATAS': useRef<HTMLInputElement>(null),
    'RESULTANTE CURRICULAR': useRef<HTMLInputElement>(null),
    'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS':
      useRef<HTMLInputElement>(null),
    'PUBLICACION FINAL': useRef<HTMLInputElement>(null),
  };

  const fileLabels: (keyof FileFields)[] = [
    'BASES',
    'ANEXOS',
    'COMUNICADOS',
    'FE DE ERRATAS',
    'RESULTANTE CURRICULAR',
    'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS',
    'PUBLICACION FINAL',
  ];

  const handleFileChange = (
    key: keyof FileFields,
    selectedFiles: FileList | null
  ) => {
    if (!selectedFiles) return;

    if (key === 'ANEXOS') {
      setFiles((prev) => ({
        ...prev,
        ANEXOS: [...prev.ANEXOS, ...Array.from(selectedFiles)],
      }));
    } else {
      setFiles((prev) => ({
        ...prev,
        [key]: selectedFiles[0] || null,
      }));
    }
  };

  const removeFile = (key: keyof FileFields, index?: number) => {
    if (key === 'ANEXOS') {
      setFiles((prev) => ({
        ...prev,
        ANEXOS: prev.ANEXOS.filter((_, i) => i !== index),
      }));
    } else {
      setFiles((prev) => ({
        ...prev,
        [key]: null,
      }));
    }

    if (fileRefs[key].current) {
      fileRefs[key].current!.value = '';
    }
  };

  const openFilePicker = (key: keyof typeof fileRefs) => {
    fileRefs[key].current?.click();
  };

  async function handleSubmit(e: React.FormEvent) {
    const { token } = getSession();

    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!title.trim() || !description.trim() || !date) {
      setMessage('Título, descripción y fecha son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);

      Object.entries(files).forEach(([key, value]) => {
        if (key === 'ANEXOS') {
          (value as File[]).forEach((file) => {
            formData.append('ANEXOS', file);
          });
        } else {
          const file = value as File | null;

          if (file) {
            formData.append(key, file);
          }
        }
      });

      const res = await fetch('http://localhost:4000/api/convocatorias', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Error al guardar la convocatoria');
      }

      router.push('/admin/convocatorias');
    } catch (err: any) {
      setMessage(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200"
      >
        <div className="border-b border-slate-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800">
            CONVOCATORIA CAS
          </h1>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Escribe el título"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 min-h-[140px] outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Escribe una descripción"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fileLabels.map((label) => (
              <div
                key={label}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50"
              >
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  {label}
                </label>

                <input
                  ref={fileRefs[label]}
                  type="file"
                  accept="application/pdf"
                  multiple={label === 'ANEXOS'}
                  className="hidden"
                  onChange={(e) => handleFileChange(label, e.target.files)}
                />

                <button
                  type="button"
                  onClick={() => openFilePicker(label)}
                  className="inline-flex items-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition"
                >
                  {label === 'ANEXOS'
                    ? 'Subir documentos'
                    : 'Subir documento'}
                </button>

                {label === 'ANEXOS' ? (
                  files.ANEXOS.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {files.ANEXOS.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between bg-white border rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-slate-600 truncate">
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFile('ANEXOS', index)}
                            className="ml-3 text-red-500 hover:text-red-700 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">
                      No se ha seleccionado ningún archivo
                    </p>
                  )
                ) : files[label] ? (
                  <div className="mt-3 flex items-center justify-between bg-white border rounded-lg px-3 py-2">
                    <span className="text-sm text-slate-600 truncate">
                      {(files[label] as File)?.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFile(label)}
                      className="ml-3 text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    No se ha seleccionado ningún archivo
                  </p>
                )}
              </div>
            ))}
          </div>

          {message && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium bg-red-100 text-red-600 border border-red-200">
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Guardando...' : 'Guardar documentos'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}