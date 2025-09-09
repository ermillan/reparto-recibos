import { useEffect, useMemo, useState } from "react";
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
  Search,
  Plus,
  Printer,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Info,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { NavLink } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

import { ProfileApi } from "@/infrastructure/services/profile/profile.api";
import { GetProfiles } from "@/application/profile/getProfiles.usecase";

// Tipos (usa tus tipos reales si ya los tienes)
type ProfileItem = {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  peso: number;
  activo: boolean;
  estado: "Activo" | "Inactivo";
};

const ROWS_SKELETON = 3;

const SkeletonTable = () => (
  <div className="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader className="bg-primary">
        <TableRow>
          <TableHead className="w-12 text-white"></TableHead>
          <TableHead className="text-white">Código</TableHead>
          <TableHead className="text-white">Nombre</TableHead>
          <TableHead className="text-white">Descripción</TableHead>
          <TableHead className="text-white">Peso</TableHead>
          <TableHead className="text-white">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: ROWS_SKELETON }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
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
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const ConsultProfiles = () => {
  // Datos en pantalla
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [lastNonEmpty, setLastNonEmpty] = useState<ProfileItem[]>([]);

  // Filtros (cliente)
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"all" | "activo" | "inactivo">("activo");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Paginación (server)
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Meta backend
  const [total, setTotal] = useState(0);

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const rangeStart = total === 0 ? 0 : (page - 1) * size + 1;
  const rangeEnd = Math.min(page * size, total);

  // Helper para mapear el filtro de UI -> query.activo
  const mapStatusToActivo = (s: "all" | "activo" | "inactivo"): boolean | undefined => {
    if (s === "activo") return true;
    if (s === "inactivo") return false;
    return undefined; // sin filtro por activo
  };

  // Carga desde backend usando GetProfiles correctamente (query object)
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);

      const api = new ProfileApi();
      const useCase = new GetProfiles(api);

      try {
        const query = {
          activo: mapStatusToActivo(status),
          nombre: description || "", // si tu API soporta vacío para "sin filtro"
          page,
          size,
        };
        const response = await useCase.execute(query);
        setProfiles(response.items);
        setTotal(response.meta.total);
        if (response.items?.length) setLastNonEmpty(response.items);
      } catch (err: any) {
        console.error("Error cargando perfiles", err);
        setError("No se pudo cargar la lista de perfiles.");
      } finally {
        setLoading(false);
      }
    };

    // Nota: si quieres que solo busque cuando des clic en "Buscar",
    // mueve description/status fuera del array de dependencias
    fetchProfiles();
  }, [page, size, status, description]);

  // Filtrado en cliente (opcional; si el servidor ya filtra por 'nombre'/'activo', podrías omitir esto)
  const filteredProfiles = useMemo(() => {
    const list = profiles ?? [];
    const text = description.trim().toLowerCase();

    return list.filter((p) => {
      const matchesText =
        (p.nombre ?? "").toLowerCase().includes(text) ||
        (p.descripcion ?? "").toLowerCase().includes(text) ||
        (p.codigo ?? "").toLowerCase().includes(text);

      const matchesStatus =
        status === "all" ||
        (status === "activo" && p.activo) ||
        (status === "inactivo" && !p.activo);

      return matchesText && matchesStatus;
    });
  }, [description, status, profiles]);

  // Conjunto final a mostrar (fallback a último snapshot si no hay coincidencias)
  const displayed =
    filteredProfiles.length > 0
      ? filteredProfiles
      : searchTriggered && lastNonEmpty.length > 0
        ? lastNonEmpty
        : filteredProfiles;

  const noExactMatches =
    searchTriggered && filteredProfiles.length === 0 && lastNonEmpty.length > 0;

  const handleSearch = () => {
    // Si prefieres que el query al backend solo se dispare aquí,
    // mueve description/status fuera del useEffect de fetch y colócalo aquí.
    setSearchTriggered(true);
    setPage(1);
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

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

      {/* Fila 1: Buscador */}
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
            onChange={(e) => setDescription(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      {/* Fila 2: Estado / Registros por página */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Estado */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <Label htmlFor="estado" className="text-xs sm:text-sm text-muted-foreground">
            Estado
          </Label>
          <Select
            value={status}
            onValueChange={(v: "all" | "activo" | "inactivo") => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger id="estado" className="h-10 w-full">
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* (Hueco para futuro filtro, por ejemplo Orden) */}
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

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
        <Button variant="secondary" className="h-10" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
        <Button variant="outline" className="h-10">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      {/* Aviso de fallback */}
      {noExactMatches && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            No hubo coincidencias exactas con el filtro. Mostrando los últimos resultados obtenidos.
          </p>
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
                <TableHead className="w-12 text-white"></TableHead>
                <TableHead className="text-white">Código</TableHead>
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Descripción</TableHead>
                {/* <TableHead className="text-white">Peso</TableHead> */}
                <TableHead className="text-white">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{p.codigo?.trim?.() ?? p.codigo}</TableCell>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.descripcion}</TableCell>
                    {/* <TableCell>{p.peso}</TableCell> */}
                    <TableCell>{p.activo ? "Activo" : "Inactivo"}</TableCell>
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

export default ConsultProfiles;
