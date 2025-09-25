// src/pages/security/profiles/ConsultProfile.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Info, PenIcon, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NavLink, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { ProfileApi } from "@/infrastructure/services/recibos.api";
import { DeleteProfile, GetProfilesPaginated } from "@/application/profiles";
import type {
  ProfilesPaginatedQuery,
  ProfilesPaginatedResponse,
} from "@/domain/profiles/profile.types";

// PaginationBar + Redux perPage
import PaginationBar from "@/components/common/PaginationBar";
import { useAppSelector } from "@/store/hooks";
import { selectPerPage } from "@/store/slices/tablePrefs.slice";

// Dialog de confirmación
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ROWS_SKELETON = 3;

const profileApi = new ProfileApi();
const getProfilesPaginatedUC = new GetProfilesPaginated(profileApi);
const deleteProfileUC = new DeleteProfile(profileApi);

const SkeletonTable = () => (
  <div className="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader className="bg-primary">
        <TableRow>
          <TableHead className="text-white">Código</TableHead>
          <TableHead className="text-white">Nombre</TableHead>
          <TableHead className="text-white">Descripción</TableHead>
          <TableHead className="text-white">Estado</TableHead>
          <TableHead className="text-white">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: ROWS_SKELETON }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-56" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const ConsultProfilesPage = () => {
  const location = useLocation();

  // Datos
  const [profiles, setProfiles] = useState<ProfilesPaginatedResponse["items"]>([]);
  const [lastNonEmpty, setLastNonEmpty] = useState<ProfilesPaginatedResponse["items"]>([]);

  // Filtros
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"activo" | "inactivo" | "todos">("activo");

  // Paginación
  const [page, setPage] = useState(1);
  const perPage = useAppSelector(selectPerPage); // <- Redux (compartido)

  // Meta UI
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal confirmación
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: ProfilesPaginatedQuery = {
        page,
        size: perPage,
        Activo: status === "todos" ? undefined : status === "activo",
        nombre: description.trim() || undefined,
      };
      const response = await getProfilesPaginatedUC.exec(query);
      setProfiles(response.items ?? []);
      setTotal(response.meta?.total ?? 0);
      if (response.items?.length) setLastNonEmpty(response.items);
    } catch (err) {
      console.error("Error cargando perfiles", err);
      setError("No se pudo cargar la lista de perfiles.");
    } finally {
      setLoading(false);
    }
  }, [status, description, page, perPage]);

  // Reset a página 1 al cambiar perPage global
  useEffect(() => {
    setPage(1);
  }, [perPage]);

  // Cargas
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);
  useEffect(() => {
    fetchProfiles();
  }, [location.key]);

  const filteredProfiles = useMemo(() => {
    const list = profiles ?? [];
    const text = description.trim().toLowerCase();
    return list.filter((p) => {
      const nombre = (p as any).nombre ?? "";
      const descripcion = (p as any).descripcion ?? "";
      const codigo = (p as any).codigo ?? "";
      return (
        String(nombre).toLowerCase().includes(text) ||
        String(descripcion).toLowerCase().includes(text) ||
        String(codigo).toLowerCase().includes(text)
      );
    });
  }, [description, profiles]);

  const displayed =
    filteredProfiles.length > 0
      ? filteredProfiles
      : (lastNonEmpty ?? []).length > 0
        ? lastNonEmpty
        : filteredProfiles;

  const noExactMatches =
    filteredProfiles.length === 0 &&
    (lastNonEmpty ?? []).length > 0 &&
    description.trim().length > 0;

  const handleDeleteProfile = async (id: number) => {
    try {
      await toast.promise(deleteProfileUC.exec(id), {
        loading: "Eliminando perfil...",
        success: "¡Perfil eliminado correctamente!",
        error: (err) => {
          if (err?.response?.data?.message) {
            return err.response.data.message;
          }
          if (err instanceof Error) {
            return err.message;
          }
          return "Error desconocido en el servidor.";
        },
      });

      setPage((p) => ((displayed ?? []).length === 1 && p > 1 ? p - 1 : p));
      fetchProfiles();
    } catch (err) {
      console.error("Error al eliminar perfil:", err);
    }
  };

  const confirmDeleteProfile = (id: number) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const proceedDelete = async () => {
    if (selectedId) {
      await handleDeleteProfile(selectedId);
      setSelectedId(null);
      setOpenConfirm(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Consulta de Perfiles</h1>
        <Button asChild variant="ghost" className="flex items-center gap-2">
          <NavLink to="/seguridad/perfiles/crear-perfil">
            <Plus className="h-4 w-4" />
            <span>Crear Perfil</span>
          </NavLink>
        </Button>
      </div>

      {/* Filtros en la misma fila */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Buscador */}
        <div className="flex flex-col gap-1.5 sm:col-span-1">
          <Label htmlFor="description" className="text-xs sm:text-sm text-muted-foreground">
            Nombre / Descripción / Código
          </Label>
          <Input
            type="text"
            id="description"
            placeholder="Buscar..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setPage(1);
            }}
            className="h-10"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="estado" className="text-xs sm:text-sm text-muted-foreground">
            Estado
          </Label>
          <Select
            value={status}
            onValueChange={(v: "activo" | "inactivo" | "todos") => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger id="estado" className="h-10 w-full">
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Aviso de fallback */}
      {noExactMatches && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5" />
          <p>Sin coincidencias exactas. Mostrando los últimos resultados obtenidos.</p>
        </div>
      )}

      {/* Tabla o Skeleton */}
      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white">Código</TableHead>
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Descripción</TableHead>
                <TableHead className="text-white">Estado</TableHead>
                <TableHead className="text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (displayed ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              ) : (
                (displayed ?? []).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.codigo?.trim?.() ?? p.codigo}</TableCell>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.descripcion}</TableCell>
                    <TableCell>{p.activo ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2">
                        <Button
                          variant="outline"
                          aria-label="Editar Perfil"
                          className="transition-colors ease-in-out duration-300 hover:bg-green-50 hover:text-green-700"
                          asChild
                        >
                          <NavLink to={`/seguridad/perfiles/actualizar-perfil/${p.id}`}>
                            <PenIcon className="h-4 w-4" />
                          </NavLink>
                        </Button>
                        <Button
                          variant="outline"
                          aria-label="Eliminar Perfil"
                          onClick={() => confirmDeleteProfile(p.id)}
                          className="transition-colors ease-in-out duration-300 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Paginación reutilizable */}
      <PaginationBar
        total={total}
        page={page}
        onPageChange={setPage}
        isLoading={loading}
        className="mt-2"
      />

      {/* Modal confirmación */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este perfil?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer. El perfil será eliminado permanentemente.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
              Cancelar
            </Button>
            <Button onClick={proceedDelete}>Sí, eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultProfilesPage;
