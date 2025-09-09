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
import {
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Info,
  PenIcon,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { NavLink, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// ⬇️ Mantengo tu import de API como lo tienes
import { ProfileApi } from "@/infrastructure/services/recibos.api";

// ⬇️ Usamos los casos de uso correctos
import { DeleteProfile, GetProfilesPaginated } from "@/application/profiles";

// ⬇️ Tipos del dominio que ya te compartí
import type {
  ProfilesPaginatedQuery,
  ProfilesPaginatedResponse,
} from "@/domain/profiles/profile.types";

const ROWS_SKELETON = 3;

// Instancias compartidas
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

const ConsultProfile = () => {
  const location = useLocation();

  // Datos (tipados con la respuesta paginada del dominio)
  const [profiles, setProfiles] = useState<ProfilesPaginatedResponse["items"]>([]);
  const [lastNonEmpty, setLastNonEmpty] = useState<ProfilesPaginatedResponse["items"]>([]);

  // Filtros
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"activo" | "inactivo">("activo");

  // Paginación (server)
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Meta backend / UI
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const rangeStart = total === 0 ? 0 : (page - 1) * size + 1;
  const rangeEnd = Math.min(page * size, total);

  // Mapea el estado del filtro a boolean estricto para el backend
  const mapStatusToActivo = (s: "activo" | "inactivo"): boolean => s === "activo";

  // Carga desde backend — usando el UC paginado + tipos del dominio
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: ProfilesPaginatedQuery = {
        page,
        size,
        Activo: mapStatusToActivo(status), // true | false
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
  }, [status, description, page, size]);

  // 1) Cargar cuando cambien filtros/paginación
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // 2) Recargar al entrar a la pantalla
  useEffect(() => {
    fetchProfiles();
  }, [location.key]);

  // Filtrado en cliente (opcional; el server ya filtra por 'activo' y 'nombre')
  const filteredProfiles = useMemo(() => {
    const list = profiles ?? [];
    const text = description.trim().toLowerCase();

    return list.filter((p) => {
      const nombre = (p as any).nombre ?? "";
      const descripcion = (p as any).descripcion ?? "";
      const codigo = (p as any).codigo ?? "";
      const matchesText =
        String(nombre).toLowerCase().includes(text) ||
        String(descripcion).toLowerCase().includes(text) ||
        String(codigo).toLowerCase().includes(text);

      return matchesText;
    });
  }, [description, profiles]);

  // Fallback de visualización
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

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handleDeleteProfile = async (id: number) => {
    // ⬇️ usa .exec del caso de uso, no .execute
    const promise = deleteProfileUC.exec(id);
    await toast.promise(promise, {
      loading: "Eliminando perfil...",
      success: "¡Perfil eliminado correctamente!",
      error: "Error en el servidor.",
    });
    // Ajustar página si borraste el último registro visible
    setPage((p) => ((displayed ?? []).length === 1 && p > 1 ? p - 1 : p));
    // Recargar la tabla después de eliminar
    fetchProfiles();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Consulta de Perfiles</h1>
        <Button asChild variant="ghost" className="flex items-center gap-2">
          <NavLink to="/seguridad/perfiles/crear-perfil">
            <Plus className="h-4 w-4" />
            <span>Agregar</span>
          </NavLink>
        </Button>
      </div>

      {/* Buscador */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid w-full items-center gap-1.5">
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
      </div>

      {/* Estado / Registros por página */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Estado */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <Label htmlFor="estado" className="text-xs sm:text-sm text-muted-foreground">
            Estado
          </Label>
          <Select
            value={status}
            onValueChange={(v: "activo" | "inactivo") => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger id="estado" className="h-10 w-full">
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* placeholder para futuras opciones */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <Label className="text-xs sm:text-sm text-muted-foreground invisible">placeholder</Label>
          <div className="h-10" />
        </div>

        {/* Registros por página */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <Label htmlFor="size" className="text-xs sm:text-sm text-muted-foreground">
            Registros por página
          </Label>
          <Select
            value={String(size)}
            onValueChange={(v) => {
              setSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger id="size" className="h-10 w-full tabular-nums">
              <SelectValue placeholder="Tamaño" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
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
                          onClick={() => handleDeleteProfile(p.id)}
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

      {/* Paginador */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium">{rangeStart}</span> –{" "}
          <span className="font-medium">{rangeEnd}</span> de{" "}
          <span className="font-medium">{total}</span> registros
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={!canPrev || loading}
            className="gap-1"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Primera</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev || loading}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <span className="text-sm text-muted-foreground">
            Página <span className="font-medium">{page}</span> de{" "}
            <span className="font-medium">{totalPages}</span>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canNext || loading}
            className="gap-1"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="hidden sm:inline">Siguiente</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={!canNext || loading}
            className="gap-1"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="hidden sm:inline">Última</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultProfile;
