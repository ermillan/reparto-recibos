import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ArrowUp,
  CalendarDays,
  File,
  Save,
  UploadIcon,
  DownloadIcon,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ReceiptApi } from "@/infrastructure/services/recibos.api";
import { ACCEPTED_TYPES, MAX_SIZE_MB } from "@/application/archive/archive.config";
import { REQUIRED_COLUMNS } from "@/domain/archives/archive.constants";

// shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import CalloutGreen from "./CalloutGreen";
import Description from "./Description";

// 📅 DatePicker externo
import DatePicker from "react-datepicker";

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

export default function NewReceiptTab() {
  const api = new ReceiptApi();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showArrow, setShowArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);
  const [missingCols, setMissingCols] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("102025");
  const [result, setResult] = useState<any | null>(null);

  // Modal
  const [openResumen, setOpenResumen] = useState(false);
  const [checked, setChecked] = useState(false);

  // Fecha SLA inicializada solo una vez
  const [slaDate, setSlaDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  });

  // ====== VALIDACIÓN DE ARCHIVO ======
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

  const validateColumns = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const headers: string[] = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[];
    const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
    setMissingCols(missing);
    setIsValidFile(missing.length === 0);
  };

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!e.dataTransfer.files?.length) return;
    const { ok, errs } = validateFiles(e.dataTransfer.files);
    if (ok.length > 0) {
      await validateColumns(ok[0]);
      setFiles([ok[0]]);
    }
    setErrors(errs);
  }, []);

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const { ok, errs } = validateFiles(e.target.files);
    if (ok.length > 0) {
      await validateColumns(ok[0]);
      setFiles([ok[0]]);
    }
    setErrors(errs);
    e.currentTarget.value = "";
  };

  const removeFile = () => {
    setFiles([]);
    setIsValidFile(false);
    setMissingCols([]);
  };

  const canUpload = useMemo(
    () => files.length === 1 && !uploading && isValidFile && periodo.trim() !== "",
    [files.length, uploading, isValidFile, periodo]
  );

  // ====== UPLOAD ======
  const handleUpload = async () => {
    if (!canUpload) return;
    setUploading(true);

    const promise = api.validateReceipts(periodo, files[0]);

    toast.promise(promise, {
      loading: "Validando archivo de recibos ...",
      success: (res) => {
        setResult(res);
        setOpenResumen(true);
        return res?.mensaje || "Validación exitosa";
      },
      error: (err) => {
        console.error("Error al validar:", err);
        const msg = err.response?.data?.mensaje || "Error al validar recibos";
        return msg;
      },
    });

    try {
      const res = await promise;
      setResult(res);
      setOpenResumen(true);
    } catch {
      // manejado en toast.promise
    } finally {
      setUploading(false);
    }
  };

  // ====== CONFIRMAR CARGA ======
  const handleConfirm = async () => {
    if (!slaDate || !result?.loteId) return;

    const fechaUtc = slaDate.toISOString();
    const promise = api.confirmReceipts(result.loteId, fechaUtc);

    toast.promise(promise, {
      loading: "Confirmando carga ⏳...",
      success: () => {
        setOpenResumen(false);
        return "Carga confirmada ✅";
      },
      error: (err) => {
        console.error("Error al confirmar:", err);
        return err.response?.data?.mensaje || "Error al confirmar ❌";
      },
    });

    try {
      await promise;
    } catch {
      // manejado en toast.promise
    }
  };

  const handleClick = () => {
    setShowArrow(true);
    setTimeout(() => setShowArrow(false), 3000);
  };

  return (
    <>
      {/* Title & description */}
      <Description />
      <CalloutGreen />

      {/* Periodo */}
      <section className="w-full flex flex-col items-center justify-center gap-1 mt-4">
        <div className="flex flex-col gap-2 min-w-xs">
          <Label htmlFor="periodo">Periodo:</Label>
          <Input
            placeholder="Ingrese periodo (ej: 202509)"
            type="text"
            name="periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
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
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        onClick={handleOpenDialog}
        role="Button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={onInputChange}
        />
        <div className="mx-auto grid max-w-sm place-items-center gap-3">
          <div className="">
            <UploadCloud className="h-12 w-12 text-primary" />
          </div>
          <div className="flex flex-col gap-2 text-sm text-center">
            <span className="text-foreground font-bold">Arrastra y suelta tu archivo aquí </span>
            <span className="flex w-full items-center justify-center"> o </span>
            <span className="border border-gray-400 py-2 px-4 rounded-md shadow-lg font-bold flex flex-row items-center gap-2 text-sm hover:bg-primary hover:text-white transition-colors ease-in-out duration-300 hover:border-primary">
              <UploadIcon className="h-5 w-5" />
              Seleccionar Archivo
            </span>
            .
          </div>
          <div className="text-xs text-muted-foreground">
            Tamaño máximo: {MAX_SIZE_MB}MB — Formatos: {ACCEPTED_TYPES.join(", ")}
          </div>
        </div>
      </section>

      {/* Lista de archivos + validación */}
      {(files.length > 0 || errors.length > 0) && (
        <section className="mx-auto mt-4 max-w-3xl space-y-3">
          {errors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <b>Archivo omitido:</b>
                  <ul className="mt-1 list-disc pl-5">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {missingCols.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <b>Faltan columnas requeridas:</b>
                  <ul className="mt-1 list-disc pl-5">
                    {missingCols.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isValidFile && files.length === 1 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  Archivo válido. Todas las columnas requeridas están presentes.
                </div>
              </div>
            </div>
          )}

          {files.map((f) => (
            <div
              key={f.name}
              className="flex items-center justify-between rounded-lg border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
              </div>
              <div className="flex gap-2">
                {result && (
                  <Button
                    onClick={() => setOpenResumen(true)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                  >
                    <File className="h-3.5 w-3.5" /> Ver resumen
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={removeFile}
                  className="transition-colors ease-in-out duration-300 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Botones */}
      <div className="mx-auto mt-6 flex max-w-3xl justify-center gap-3">
        <Button onClick={handleUpload} disabled={!canUpload} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          {uploading ? "Subiendo..." : "Validar archivo"}
        </Button>

        <div className="relative inline-block">
          <a
            href={`/FrontRepartoRecibos/template/plantilla-recibos.xlsx`}
            download
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <DownloadIcon className="h-4 w-4" />
            Descargar plantilla
          </a>
          {showArrow && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
              <ArrowUp className="h-6 w-6 text-emerald-600 drop-shadow-md" />
            </div>
          )}
        </div>
      </div>

      {/* Resumen en Modal */}
      {result && (
        <Dialog open={openResumen} onOpenChange={setOpenResumen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-sky-700">Resumen de carga de recibos</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-sm max-h-[70vh] overflow-y-auto pr-2">
              {/* Lote & Estado */}
              <div className="rounded-md border p-3">
                <p>
                  <b>Lote ID:</b> {result.loteId}
                </p>
                <p>
                  <b>Estado:</b> {result.estado}
                </p>
              </div>

              {/* Archivo */}
              <div className="rounded-md border p-3">
                <p>
                  <b>Archivo:</b> {result.archivo?.nombre}
                </p>
                <p>
                  <b>Tamaño:</b> {(result.archivo?.bytes / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              {/* Totales */}
              <div className="rounded-md border p-3">
                <p>
                  <b>Filas:</b> {result.totales?.filas}
                </p>
                <p>
                  <b>Válidas:</b> {result.totales?.validas}
                </p>
                <p>
                  <b>Inválidas:</b> {result.totales?.invalidas}
                </p>
              </div>

              {/* Contratistas */}
              {result.contratistas?.length > 0 && (
                <div className="rounded-md border p-3">
                  <p className="font-medium text-sky-600 mb-2">Contratistas:</p>
                  <div className="grid gap-3">
                    {result.contratistas.map((c: any) => (
                      <div
                        key={c.id}
                        className="rounded-lg border p-3 bg-gray-50 shadow-sm hover:shadow transition"
                      >
                        <p className="text-sm font-semibold text-gray-800 mb-1">{c.nombre}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                          <p>
                            <b>Filas:</b> {c.filas}
                          </p>
                          <p>
                            <b>Válidas:</b> {c.validas}
                          </p>
                          <p>
                            <b>Inválidas:</b> {c.invalidas}
                          </p>
                          <p>
                            <b>Duplicados archivo:</b> {c.duplicadosArchivo}
                          </p>
                          <p>
                            <b>Duplicados BD:</b> {c.duplicadosBd}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Porciones */}
              {result.porciones?.length > 0 && (
                <div className="rounded-md border p-3">
                  <p className="font-medium text-sky-600">Porciones:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {result.porciones.map((p: any) => (
                      <li key={p.codigo}>
                        <b>{p.codigo}</b> — Filas: {p.filas}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Errores */}
              {result.errores?.total > 0 && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  <p className="font-medium">Errores encontrados ({result.errores.total})</p>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-xs">
                    {result.errores.muestra.map((err: any, idx: number) => (
                      <li key={idx}>
                        Fila {err.row} — Columna <b>{err.columna}</b> ({err.codigo}): {err.mensaje}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SLA Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-sky-600" />
                  Fecha y hora de inicio SLA:
                </Label>
                <DatePicker
                  selected={slaDate}
                  onChange={(date: Date | null) => date && setSlaDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="dd/MM/yyyy HH:mm"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="confirmar"
                  checked={checked}
                  onCheckedChange={(v) => setChecked(!!v)}
                />
                <Label htmlFor="confirmar">Quiero proceder con la carga</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenResumen(false)}>
                Cancelar
              </Button>
              <Button
                disabled={!checked || !slaDate || !result.confirmable}
                onClick={handleConfirm}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Confirmar carga
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
