import React, { useCallback, useMemo, useRef, useState } from "react";
import { UploadCloud, Info, X, CheckCircle2, AlertTriangle, FileSpreadsheet } from "lucide-react";

type TabKey = "uploaded" | "new";

const ACCEPTED_TYPES = [".csv", ".xlsx", ".xls"];
const MAX_SIZE_MB = 10;

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default function ReceiptUploadPage() {
  const [tab, setTab] = useState<TabKey>("new");

  // ====== NEW FILES (upload) state ======
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenDialog = () => inputRef.current?.click();

  const validateFiles = (list: FileList | File[]) => {
    const ok: File[] = [];
    const errs: string[] = [];

    Array.from(list).forEach((f) => {
      const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
      const sizeOk = f.size <= MAX_SIZE_MB * 1024 * 1024;
      const typeOk = ACCEPTED_TYPES.includes(ext);
      if (!typeOk) errs.push(`Tipo no permitido: ${f.name}`);
      if (!sizeOk) errs.push(`Excede ${MAX_SIZE_MB}MB: ${f.name} (${formatBytes(f.size)})`);
      if (typeOk && sizeOk) ok.push(f);
    });

    return { ok, errs };
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!e.dataTransfer.files?.length) return;
    const { ok, errs } = validateFiles(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...ok]);
    setErrors((prev) => [...prev, ...errs]);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const { ok, errs } = validateFiles(e.target.files);
    setFiles((prev) => [...prev, ...ok]);
    setErrors((prev) => [...prev, ...errs]);
    e.currentTarget.value = ""; // reset input
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const canUpload = useMemo(() => files.length > 0 && !uploading, [files.length, uploading]);

  // Simulación de upload
  const handleUpload = async () => {
    if (!canUpload) return;
    try {
      setUploading(true);
      await new Promise((r) => setTimeout(r, 1200)); // simula API
      setFiles([]);
      setErrors([]);
      alert("Archivos subidos correctamente");
    } catch (e: any) {
      console.log(e);
      alert("Error al subir. Intenta nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  // ====== MOCK de “ya cargados” ======
  const [filters, setFilters] = useState({
    periodo: "",
    ciclo: "",
    contratista: "Todos",
    estado: "En proceso",
  });
  const loadedRows = [
    {
      id: 1,
      ciclo: 9,
      contratista: "COBRA",
      cliente: "RG",
      entregado: "100%",
      meta: "00:—",
      inicio: "10/07/2025 08:00",
      fin: "11/07/2025 14:30",
    },
    {
      id: 2,
      ciclo: 8,
      contratista: "DOMINON",
      cliente: "RG",
      entregado: "99%",
      meta: "01:—",
      inicio: "11/07/2025 09:00",
      fin: "12/07/2025 17:45",
    },
    {
      id: 3,
      ciclo: 7,
      contratista: "BUREAU",
      cliente: "INDUSTRIAL",
      entregado: "99%",
      meta: "00:—",
      inicio: "12/07/2025 07:30",
      fin: "13/07/2025 13:00",
    },
  ];

  return (
    <div className="w-full">
      <header className="mx-auto max-w-6xl px-4 pt-6">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 text-sm">
          <button
            className={classNames(
              "border-b-2 pb-2 transition-colors",
              tab === "uploaded"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab("uploaded")}
            aria-current={tab === "uploaded" ? "page" : undefined}
          >
            Archivo(s) ya cargado(s)
          </button>
          <button
            className={classNames(
              "border-b-2 pb-2 transition-colors",
              tab === "new"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab("new")}
            aria-current={tab === "new" ? "page" : undefined}
          >
            Carga de archivo(s)
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-6">
        {tab === "new" ? (
          <>
            {/* Title & description */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-sky-700">Carga de archivos</h1>
              <p className="mx-auto mt-2 max-w-3xl text-sm text-muted-foreground">
                Utiliza esta herramienta para subir archivos con recibos físicos (tipo <b>FIS</b>)
                de forma masiva. Estos archivos son exportados desde la plataforma <b>SAP</b> cada
                ciclo.
              </p>
            </div>

            {/* Callout */}
            <section className="mx-auto mt-6 max-w-3xl rounded-xl border bg-emerald-50 p-4 text-emerald-800">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-emerald-600/10 p-1.5 text-emerald-700">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Instrucciones importantes</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>
                      Solo se deben subir archivos con recibos de tipo <b>FIS</b>.
                    </li>
                    <li>
                      El archivo no debe pesar más de <b>{MAX_SIZE_MB}MB</b>.
                    </li>
                    <li>Formatos permitidos: {ACCEPTED_TYPES.join(", ")}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Dropzone */}
            <section
              className={classNames(
                "mx-auto mt-6 max-w-3xl cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
                isDragging
                  ? "border-sky-500 bg-sky-50"
                  : "border-muted-foreground/30 hover:border-sky-400"
              )}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleOpenDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpenDialog()}
              aria-label="Zona para arrastrar y soltar o hacer click para seleccionar archivos"
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={onInputChange}
              />
              <div className="mx-auto grid max-w-sm place-items-center gap-3">
                <div className="rounded-full bg-sky-100 p-3 text-sky-600">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="text-sm">
                  <span className="font-medium text-foreground">Arrastra y suelta</span> tus
                  archivos aquí, o{" "}
                  <span className="font-medium text-sky-600 underline">
                    haz click para seleccionar
                  </span>
                  .
                </div>
                <div className="text-xs text-muted-foreground">
                  Tamaño máx. por archivo: {MAX_SIZE_MB}MB — Tipos: {ACCEPTED_TYPES.join(", ")}
                </div>
              </div>
            </section>

            {/* Lista de archivos */}
            {(files.length > 0 || errors.length > 0) && (
              <section className="mx-auto mt-4 max-w-3xl space-y-3">
                {errors.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div className="text-sm">
                        <b>Archivos omitidos:</b>
                        <ul className="mt-1 list-disc pl-5">
                          {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {files.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                      aria-label={`Quitar ${f.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                      Quitar
                    </button>
                  </div>
                ))}
              </section>
            )}

            {/* Botones de acción */}
            <div className="mx-auto mt-6 flex max-w-3xl justify-center gap-3">
              <button
                onClick={handleUpload}
                disabled={!canUpload}
                className={classNames(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors",
                  canUpload ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-300"
                )}
              >
                <UploadCloud className="h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir archivo de recibos"}
              </button>

              <a
                href={`/FrontRepartoRecibos/template/plantilla-recibos.xlsx`}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Descargar plantilla
              </a>
            </div>

            {/* Hint */}
            {files.length === 0 && errors.length === 0 && !uploading && (
              <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-muted-foreground">
                Después de subir, podrás ver el estado en la pestaña “Archivo(s) ya cargado(s)”.
              </p>
            )}
          </>
        ) : (
          <>
            {/* Filtros */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs text-muted-foreground">Periodo</label>
                <input
                  className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="202509"
                  value={filters.periodo}
                  onChange={(e) => setFilters((p) => ({ ...p, periodo: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Ciclo</label>
                <input
                  className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="Ciclo"
                  value={filters.ciclo}
                  onChange={(e) => setFilters((p) => ({ ...p, ciclo: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Contratista</label>
                <select
                  className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={filters.contratista}
                  onChange={(e) => setFilters((p) => ({ ...p, contratista: e.target.value }))}
                >
                  <option>Todos</option>
                  <option>COBRA</option>
                  <option>DOMINON</option>
                  <option>BUREAU</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Estado</label>
                <select
                  className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={filters.estado}
                  onChange={(e) => setFilters((p) => ({ ...p, estado: e.target.value }))}
                >
                  <option>En proceso</option>
                  <option>Completado</option>
                  <option>Error</option>
                </select>
              </div>
            </div>

            {/* Tabla mock */}
            <div className="mt-4 overflow-x-auto rounded-lg border">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-sky-600 text-left text-white">
                    <th className="px-3 py-2">Ciclo</th>
                    <th className="px-3 py-2">Contratista</th>
                    <th className="px-3 py-2">Cliente</th>
                    <th className="px-3 py-2">Entregado</th>
                    <th className="px-3 py-2">Meta %</th>
                    <th className="px-3 py-2">Inicio Reparto</th>
                    <th className="px-3 py-2">Fin Reparto</th>
                    <th className="px-3 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {loadedRows.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{r.ciclo}</td>
                      <td className="px-3 py-2">{r.contratista}</td>
                      <td className="px-3 py-2">{r.cliente}</td>
                      <td className="px-3 py-2">{r.entregado}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">{r.inicio}</td>
                      <td className="px-3 py-2">{r.fin}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          OK
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
