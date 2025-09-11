import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Casos de uso / API
import { ParamsApi } from "@/infrastructure/services/recibos.api";
import { GetSystemParameters, UpdateSystemParameters } from "@/application/params";
import type { SystemParams } from "@/domain/params/params.types";

const api = new ParamsApi();
const getParamsUseCase = new GetSystemParameters(api);
const updateParamsUseCase = new UpdateSystemParameters(api);

// Tipo UI (solo strings para inputs)
type SystemParamsForm = {
  gpsRadius: string;
  slaHours: string;
  rowVer: string;
};

// Regex para validar solo números enteros positivos
const numberRegex = /^[0-9]+$/;

const UpdateParamsPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<SystemParamsForm>({
    gpsRadius: "",
    slaHours: "",
    rowVer: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🔄 Cargar parámetros desde API */
  const loadParams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getParamsUseCase.exec();
      setForm({
        gpsRadius: String(data.radioGpsMetros ?? ""),
        slaHours: String(data.slaEntregaHoras ?? ""),
        rowVer: data.rowVer ?? "",
      });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudieron cargar los parámetros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParams();
  }, []);

  /** ✍️ Manejo de cambios de inputs */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value, // siempre texto
    }));
  };

  /** 💾 Guardar cambios */
  const handleSave = async () => {
    if (saving) return;

    // Validaciones
    if (!numberRegex.test(form.gpsRadius)) {
      toast.error("El radio GPS debe ser un número válido.");
      return;
    }
    if (!numberRegex.test(form.slaHours)) {
      toast.error("El SLA en horas debe ser un número válido.");
      return;
    }

    const payload: SystemParams = {
      radioGpsMetros: Number(form.gpsRadius),
      slaEntregaHoras: Number(form.slaHours),
      rowVer: form.rowVer,
    };

    setSaving(true);
    setError(null);

    try {
      await toast.promise(updateParamsUseCase.exec(payload), {
        loading: "Guardando parámetros...",
        success: "¡Parámetros guardados correctamente!",
        error: "No se pudo actualizar los parámetros.",
      });

      // ✅ Redirigir al dashboard
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      toast.error("❌ Falló la actualización de parámetros.");
    } finally {
      setSaving(false);
    }
  };

  const formDisabled = loading || saving;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-xl font-semibold text-primary">Parámetros del sistema</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Configuración</h2>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>
      </div>

      {error && (
        <div className="rounded border border-destructive/50 bg-destructive/10 text-destructive p-3 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-md border p-4 space-y-4">
        {loading ? (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando parámetros...
          </span>
        ) : (
          <>
            <div className="grid gap-2">
              <Label htmlFor="gpsRadius">Radio óptimo para marcación GPS (metros)*</Label>
              <Input
                id="gpsRadius"
                name="gpsRadius"
                type="text" // 👈 texto en lugar de number
                value={form.gpsRadius}
                onChange={handleChange}
                disabled={formDisabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slaHours">
                SLA para la entrega de recibos por el contratista (horas)*
              </Label>
              <Input
                id="slaHours"
                name="slaHours"
                type="text" // 👈 texto en lugar de number
                value={form.slaHours}
                onChange={handleChange}
                disabled={formDisabled}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={formDisabled} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default UpdateParamsPage;
