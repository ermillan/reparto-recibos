import React, { useEffect, useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  GetAccessOptions,
  CreateProfile,
  GetProfileById,
  UpdateProfile,
} from "@/application/profiles";

import type {
  CreateProfileRequest,
  UpdateProfileRequest,
  ProfileMenuOption,
} from "@/domain/profiles/profile.types";
import { ProfileApi } from "@/infrastructure/services/recibos.api";

/* ===================== Helpers árbol ===================== */

const deepCloneMenu = (items: ProfileMenuOption[]): ProfileMenuOption[] =>
  (items ?? []).map((i) => ({ ...i, sub: deepCloneMenu(i.sub ?? []) }));

const setCheckDeep = (item: ProfileMenuOption, checked: boolean): ProfileMenuOption => ({
  ...item,
  check: checked,
  sub: (item.sub ?? []).map((ch) => setCheckDeep(ch, checked)),
});

const toggleNodeById = (
  nodes: ProfileMenuOption[],
  id: number,
  mode: "self" | "self+children"
): ProfileMenuOption[] =>
  nodes.map((node) => {
    if (node.id === id) {
      const newCheck = !node.check;
      return mode === "self+children" ? setCheckDeep(node, newCheck) : { ...node, check: newCheck };
    }
    return node.sub?.length ? { ...node, sub: toggleNodeById(node.sub, id, mode) } : node;
  });

const indexChecksFromProfile = (nodes: ProfileMenuOption[] | undefined) => {
  const map = new Map<number, boolean>();
  const walk = (n: ProfileMenuOption) => {
    map.set(n.id, !!n.check);
    (n.sub ?? []).forEach(walk);
  };
  (nodes ?? []).forEach(walk);
  return map;
};

const applyChecksToBase = (
  base: ProfileMenuOption[],
  checks: Map<number, boolean>
): ProfileMenuOption[] =>
  base.map((n) => ({
    ...n,
    check: checks.has(n.id) ? !!checks.get(n.id) : !!n.check,
    sub: applyChecksToBase(n.sub ?? [], checks),
  }));

const collectCheckedIds = (nodes: ProfileMenuOption[], ancestorsChecked = true): number[] => {
  const ids: number[] = [];
  nodes.forEach((n) => {
    const currentAllowed = ancestorsChecked && !!n.check;
    if (currentAllowed) ids.push(n.id);
    if (n.sub?.length) ids.push(...collectCheckedIds(n.sub, currentAllowed));
  });
  return ids;
};

const allChildrenChecked = (item: ProfileMenuOption): boolean =>
  Array.isArray(item.sub) &&
  item.sub.length > 0 &&
  item.sub.every((ch) => ch.check && allChildrenChecked(ch));

/* ===================== Casos de uso / API ===================== */

const api = new ProfileApi();
const accessUseCase = new GetAccessOptions(api);
const createUseCase = new CreateProfile(api);
const getProfileByIdUseCase = new GetProfileById(api);
const updateUseCase = new UpdateProfile(api);

/* ===================== Componente ===================== */

const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accesos
  const [menu, setMenu] = useState<ProfileMenuOption[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // Carga inicial (accesos + perfil en paralelo)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [access, profile] = await Promise.all([
          accessUseCase.exec(), // { menu: [...] }
          isEdit && id ? getProfileByIdUseCase.exec(Number(id)) : Promise.resolve(null),
        ]);

        const base = deepCloneMenu(access.menu ?? []);

        // expandir primer nivel
        const defaultExpanded: Record<number, boolean> = {};
        base.forEach((m) => {
          defaultExpanded[m.id] = true;
        });

        if (profile) {
          // precarga de campos
          setName(profile.nombre ?? "");
          setDescription(profile.descripcion ?? "");
          setStatus(profile.activo ? "active" : "inactive");

          // aplicar checks al árbol base
          const checksMap = indexChecksFromProfile(profile.menu ?? []);
          const merged = applyChecksToBase(base, checksMap);
          setMenu(merged);
        } else {
          setMenu(base);
        }

        setExpanded(defaultExpanded);
      } catch (e: any) {
        console.error(e);
        setError(
          e?.response?.data?.title ||
            e?.response?.data?.message ||
            e?.message ||
            "No se pudo cargar la información necesaria."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isEdit, id]);

  const toggleExpand = (nodeId: number) => {
    setExpanded((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleToggleCheck = (node: ProfileMenuOption, cascade = true) => {
    setMenu((prev) => toggleNodeById(prev, node.id, cascade ? "self+children" : "self"));
  };

  const TreeNode: React.FC<{ node: ProfileMenuOption; ancestorsChecked?: boolean }> = ({
    node,
    ancestorsChecked = true,
  }) => {
    const hasChildren = (node.sub?.length ?? 0) > 0;
    const isOpen = expanded[node.id] ?? false;

    const disabled = !ancestorsChecked || loading || saving;
    const nextAncestorsChecked = ancestorsChecked && !!node.check;

    return (
      <div className="pl-2">
        <div className="flex items-center gap-2 py-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(node.id)}
              className="inline-flex items-center justify-center rounded hover:bg-muted/60 p-1 disabled:opacity-50"
              aria-label={isOpen ? "Contraer" : "Expandir"}
            >
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <span className="w-6" />
          )}

          <Checkbox
            id={`menu-${node.id}`}
            checked={!!node.check}
            disabled={disabled}
            onCheckedChange={() => !disabled && handleToggleCheck(node, true)}
          />
          <Label
            htmlFor={`menu-${node.id}`}
            className={`select-none ${disabled ? "text-muted-foreground opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {node.name}
          </Label>

          {hasChildren && (
            <span className="ml-2 text-xs text-muted-foreground">
              {allChildrenChecked(node) ? "(todo seleccionado)" : ""}
            </span>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="pl-6 border-l border-muted">
            {node.sub!.map((child) => (
              <Fragment key={child.id}>
                <TreeNode node={child} ancestorsChecked={nextAncestorsChecked} />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Completa nombre y descripción.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const opcionIds = collectCheckedIds(menu);

      if (isEdit && id) {
        const payload: UpdateProfileRequest = {
          id: Number(id),
          nombre: name.trim(),
          descripcion: description.trim(),
          activo: status === "active",
          opcionIds,
        };

        await toast.promise(updateUseCase.exec(payload), {
          loading: "Actualizando perfil...",
          success: "¡Perfil actualizado correctamente!",
          error: (err) =>
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            "Error en el servidor.",
        });
      } else {
        const payload: CreateProfileRequest = {
          nombre: name.trim(),
          descripcion: description.trim(),
          activo: status === "active",
          opcionIds,
        };

        await toast.promise(createUseCase.exec(payload), {
          loading: "Creando perfil...",
          success: "¡Perfil creado correctamente!",
          error: (err) =>
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            "Error en el servidor.",
        });
      }

      navigate("/seguridad/perfiles");
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.title ||
          e?.response?.data?.message ||
          e?.message ||
          "Ocurrió un error al guardar el perfil."
      );
    } finally {
      setSaving(false);
    }
  };

  const formDisabled = loading || saving;
  const pageTitle = isEdit ? `Editar perfil #${id}` : "Crear nuevo perfil";
  const buttonLabel = isEdit ? "Actualizar" : "Crear";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-xl font-semibold text-primary">{pageTitle}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Accesos del Perfil</h2>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/seguridad/perfiles")}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="rounded-md border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Datos</h3>
            {loading && (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Ingrese nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={formDisabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Input
              id="descripcion"
              placeholder="Ingrese la descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={formDisabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={status}
              onValueChange={(v: "active" | "inactive") => setStatus(v)}
              disabled={formDisabled}
            >
              <SelectTrigger id="estado" className="w-full">
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Columna derecha - Accesos dinámicos */}
        <div className="rounded-md border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Accesos</h3>
            {loading && (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando accesos...
              </span>
            )}
          </div>

          {!loading && menu.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay accesos disponibles.</p>
          ) : (
            <div className="space-y-1">
              {menu.map((root) => (
                <Fragment key={root.id}>
                  <TreeNode node={root} ancestorsChecked={true} />
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={formDisabled} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default CreateProfilePage;
