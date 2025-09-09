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
  CreateProfile as CreateProfileUseCase,
  GetProfileById as GetProfileByIdUseCase,
  UpdateProfileById as UpdateProfileUseCase,
} from "@/application/profile";
import { ProfileApi } from "@/infrastructure/services/profile/profile.api";
import type {
  CreateProfileDto,
  UpdateProfilePayload,
  ProfileMenuItem,
} from "@/domain/profile/profile.types";

// ===== Helpers árbol =====
const deepCloneMenu = (items: ProfileMenuItem[]): ProfileMenuItem[] =>
  (items ?? []).map((i) => ({ ...i, sub: deepCloneMenu(i.sub ?? []) }));

const setCheckDeep = (item: ProfileMenuItem, checked: boolean): ProfileMenuItem => ({
  ...item,
  check: checked,
  sub: (item.sub ?? []).map((ch) => setCheckDeep(ch, checked)),
});

const toggleNodeById = (
  nodes: ProfileMenuItem[],
  id: number,
  mode: "self" | "self+children"
): ProfileMenuItem[] =>
  nodes.map((node) => {
    if (node.id === id) {
      const newCheck = !node.check;
      return mode === "self+children" ? setCheckDeep(node, newCheck) : { ...node, check: newCheck };
    }
    return node.sub?.length ? { ...node, sub: toggleNodeById(node.sub, id, mode) } : node;
  });

// Construye un mapa id -> check desde el menú del perfil (respuesta del backend)
const indexChecksFromProfile = (nodes: ProfileMenuItem[] | undefined) => {
  const map = new Map<number, boolean>();
  const walk = (n: ProfileMenuItem) => {
    map.set(n.id, !!n.check);
    (n.sub ?? []).forEach(walk);
  };
  (nodes ?? []).forEach(walk);
  return map;
};

// Aplica checks de un mapa al árbol base
const applyChecksToBase = (
  base: ProfileMenuItem[],
  checks: Map<number, boolean>
): ProfileMenuItem[] =>
  base.map((n) => ({
    ...n,
    check: checks.has(n.id) ? !!checks.get(n.id) : !!n.check,
    sub: applyChecksToBase(n.sub ?? [], checks),
  }));

// Recolecta IDs solo si el nodo y TODOS sus ancestros están marcados (para guardar)
const collectCheckedIds = (nodes: ProfileMenuItem[], ancestorsChecked = true): number[] => {
  const ids: number[] = [];
  nodes.forEach((n) => {
    const currentAllowed = ancestorsChecked && !!n.check;
    if (currentAllowed) ids.push(n.id);
    if (n.sub?.length) {
      ids.push(...collectCheckedIds(n.sub, currentAllowed));
    }
  });
  return ids;
};

const allChildrenChecked = (item: ProfileMenuItem): boolean =>
  (item.sub ?? []).length > 0 && item.sub.every((ch) => ch.check && allChildrenChecked(ch));

// ===== Instancias de casos de uso =====
const api = new ProfileApi();
const accessUseCase = new GetAccessOptions(api);
const createUseCase = new CreateProfileUseCase(api);
const getProfileByIdUseCase = new GetProfileByIdUseCase(api);
const updateUseCase = new UpdateProfileUseCase(api);

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form
  const [name, setName] = useState(""); // nombre
  const [description, setDescription] = useState(""); // descripción
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accesos
  const [menu, setMenu] = useState<ProfileMenuItem[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Obtener menú base
        const access = await accessUseCase.execute(); // { menu: [...] }
        const base = deepCloneMenu(access.menu ?? []);

        // expandir primer nivel
        const defaultExpanded: Record<number, boolean> = {};
        base.forEach((m) => {
          defaultExpanded[m.id] = true;
        });

        // 2) Si edit, traer perfil y aplicar datos + checks
        if (isEdit && id) {
          const profile = await getProfileByIdUseCase.execute(Number(id));
          setName(profile.nombre ?? "");
          setDescription(profile.descripcion ?? "");
          setStatus(profile.activo ? "active" : "inactive");

          const checksMap = indexChecksFromProfile(profile.menu);
          const merged = applyChecksToBase(base, checksMap);

          setMenu(merged);
          setExpanded(defaultExpanded);
        } else {
          setMenu(base);
          setExpanded(defaultExpanded);
        }
      } catch (e: any) {
        console.error(e);
        setError("No se pudo cargar la información necesaria.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isEdit, id]);

  const toggleExpand = (nodeId: number) => {
    setExpanded((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleToggleCheck = (node: ProfileMenuItem, cascade = true) => {
    setMenu((prev) => toggleNodeById(prev, node.id, cascade ? "self+children" : "self"));
  };

  // Nodo del árbol con herencia de “habilitado/deshabilitado” desde el padre
  const TreeNode: React.FC<{ node: ProfileMenuItem; ancestorsChecked?: boolean }> = ({
    node,
    ancestorsChecked = true,
  }) => {
    const hasChildren = (node.sub?.length ?? 0) > 0;
    const isOpen = expanded[node.id] ?? false;

    // Si algún ancestro está desmarcado, este nodo (y sus hijos) quedan deshabilitados
    const disabled = !ancestorsChecked;

    // Para hijos: habilitados si ancestros (incluido el padre) están marcados
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
            onCheckedChange={() => {
              if (!disabled) handleToggleCheck(node, true); // padre → hijos
            }}
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
        const payload: UpdateProfilePayload = {
          id: Number(id),
          nombre: name.trim(),
          descripcion: description.trim(),
          activo: status === "active",
          opcionIds,
        };

        // ✅ Esperar el update ANTES de navegar
        await toast.promise(updateUseCase.execute(Number(id), payload), {
          loading: "Actualizando perfil...",
          success: "¡Perfil actualizado correctamente!",
          error: (err) =>
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            "Error en el servidor.",
        });
      } else {
        const payload: CreateProfileDto = {
          nombre: name.trim(),
          descripcion: description.trim(),
          activo: status === "active",
          opcionIds,
        };

        await toast.promise(createUseCase.execute(payload), {
          loading: "Creando perfil...",
          success: "¡Perfil creado correctamente!",
          error: (err) =>
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            "Error en el servidor.",
        });
      }

      // ✅ Navega SIEMPRE a la lista (evita navigate(-1))
      navigate("/seguridad/perfiles");
      // Si quieres “bustear” cache del router: navigate(`/seguridad/perfiles?r=${Date.now()}`)
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

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1>{isEdit ? `Editar perfil #${id}` : "Crear nuevo perfil"}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Accesos del Perfil</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/seguridad/perfiles")}
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
            <h2 className="font-semibold">Datos</h2>
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
              disabled={loading || saving}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Input
              id="descripcion"
              placeholder="Ingrese la descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading || saving}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={status}
              onValueChange={(v: "active" | "inactive") => setStatus(v)}
              disabled={loading || saving}
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
            <h2 className="font-semibold">Accesos</h2>
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
        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </div>
  );
};

export default CreateProfile;
