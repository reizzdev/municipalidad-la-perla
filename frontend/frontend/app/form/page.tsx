'use client';

import { useRef, useState } from 'react';

type FileFields = {
  BASES: File | null;
  ANEXOS: File | null;
  COMUNICADOS: File | null;
  'FE DE ERRATAS': File | null;
  'RESULTANTE CURRICULAR': File | null;
  'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS': File | null;
  'PUBLICACION FINAL': File | null;
};

export default function ConvocatoriaCASForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [files, setFiles] = useState<FileFields>({
    BASES: null,
    ANEXOS: null,
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

  const handleFileChange = (key: keyof FileFields, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const removeFile = (key: keyof FileFields) => {
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    if (fileRefs[key].current) {
      fileRefs[key].current!.value = '';
    }
  };

  const openFilePicker = (key: keyof typeof fileRefs) => {
    fileRefs[key].current?.click();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // VALIDACIÓN
    if (!title.trim() || !description.trim()) {
      setMessage('Título y descripción son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append('title', title);
      formData.append('description', description);

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const res = await fetch('/api/convocatorias', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir documentos');

      setMessage('Documentos subidos correctamente');

      // limpiar
      setTitle('');
      setDescription('');
      setFiles({
        BASES: null,
        ANEXOS: null,
        COMUNICADOS: null,
        'FE DE ERRATAS': null,
        'RESULTANTE CURRICULAR': null,
        'RESULTANTE EVALUACION PSICOTECNICA Y DE CONOCIMIENTOS': null,
        'PUBLICACION FINAL': null,
      });

      Object.values(fileRefs).forEach((ref) => {
        if (ref.current) ref.current.value = '';
      });

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
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800">
            CONVOCATORIA CAS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete la información y adjunte documentos en PDF.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe el título"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escribe una descripción"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 min-h-[140px] outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Archivos */}
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
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(label, e.target.files?.[0] || null)
                  }
                />

                <button
                  type="button"
                  onClick={() => openFilePicker(label)}
                  className="inline-flex items-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 transition"
                >
                  Subir documento
                </button>

                {files[label] ? (
                  <div className="mt-3 flex items-center justify-between bg-white border rounded-lg px-3 py-2">
                    <span className="text-sm text-slate-600 truncate">
                      {files[label]?.name}
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

          {/* Mensaje */}
          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                message.includes('correctamente')
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-600 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          {/* Botón */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Subiendo...' : 'Guardar documentos'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}