import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  RotateCcw,
  FileSpreadsheet,
  MapPin,
  Calendar,
  Building2,
  Layers,
} from "lucide-react";
import PaginationBar from "@/components/common/PaginationBar";
import { toast } from "sonner";

// Application
import { useAuth } from "@/hooks/use-auth";
import { useAppSelector } from "@/store/hooks";
import { selectPerPage } from "@/store/slices/tablePrefs.slice";
import { AssignmentApi } from "@/infrastructure/services/recibos.api";
import type { AssignmentItem, FiltersAssignmentResult } from "@/domain/assignment/assignmen.types";

// Instancia API
const assignmentApi = new AssignmentApi();

const ReceiptListPage = () => {
  const { user } = useAuth();
  const perPage = useAppSelector(selectPerPage);

  // Filtros
  const [periodo, setPeriodo] = useState("Todos");
  const [distrito, setDistrito] = useState("Todos");
  const [porcion, setPorcion] = useState("Todos");
  const [contratista, setContratista] = useState("Todos");

  // Data de filtros
  const [filterData, setFilterData] = useState<FiltersAssignmentResult | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Asignaciones (Recibos)
  const [rows, setRows] = useState<AssignmentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortDesc, setSortDesc] = useState(true);
  const [loading, setLoading] = useState(false);

  const uid = Number(user?.id ?? 0);
  const idContratista = user?.roles === "Contratista" ? Number(user?.id) : undefined;

  // Fetch filtros dinámicos
  const fetchFilters = useCallback(async () => {
    try {
      setLoadingFilters(true);
      const result = await assignmentApi.getFilters({
        uid: Number(uid),
        idContratista,
        periodo: periodo !== "Todos" ? periodo : undefined,
        distrito: distrito !== "Todos" ? distrito : undefined,
        porcion: porcion !== "Todos" ? porcion : undefined,
      });
      setFilterData(result);
    } catch (error) {
      toast.error("Error al cargar filtros");
    } finally {
      setLoadingFilters(false);
    }
  }, [uid, idContratista, periodo, distrito, porcion]);

  // Fetch asignaciones paginadas
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await assignmentApi.getAssignmentsPaginated({
        uid,
        idContratista,
        periodo: periodo !== "Todos" ? periodo : undefined,
        distrito: distrito !== "Todos" ? distrito : undefined,
        porcion: porcion !== "Todos" ? porcion : undefined,
        page,
        pageSize: perPage,
      });

      setRows(result.items ?? []);
      setTotal(result.totalCount ?? 0);
    } catch (error) {
      toast.error("Error al cargar los recibos");
    } finally {
      setLoading(false);
    }
  }, [uid, idContratista, periodo, distrito, porcion, page, perPage]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleSort = () => {
    setSortDesc((p) => !p);
  };

  const renderSortIcon = () =>
    sortDesc ? (
      <ArrowDown className="inline h-4 w-4 ml-1" />
    ) : (
      <ArrowUp className="inline h-4 w-4 ml-1" />
    );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Lista de Recibos</h1>

        <div className="flex gap-2 w-full sm:w-auto justify-center">
          {/* <Button
            variant="ghost"
            className="justify-center gap-2"
            onClick={() => {
              setPeriodo("Todos");
              setDistrito("Todos");
              setPorcion("Todos");
              setContratista("Todos");
              setPage(1);
              fetchAssignments();
            }}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button> */}

          {/* <div className="w-full h-full flex items-center justify-center">
            <a
              href={`/`}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Descargar
            </a>
          </div> */}
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-md border p-4 md:p-5 bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Periodo */}
          <div className="grid gap-2">
            <Label htmlFor="periodo">Periodo</Label>
            <Select
              value={periodo}
              onValueChange={(v) => {
                setPeriodo(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="periodo" className="h-12 w-full">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="Todos">Todos</SelectItem>
                {loadingFilters ? (
                  <SelectItem value="__loading" disabled>
                    Cargando...
                  </SelectItem>
                ) : (
                  filterData?.periodos?.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Distrito */}
          <div className="grid gap-2">
            <Label htmlFor="distrito">Distrito</Label>
            <Select
              value={distrito}
              onValueChange={(v) => {
                setDistrito(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="distrito" className="h-12 w-full">
                <SelectValue placeholder="Distrito" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="Todos">Todos</SelectItem>
                {filterData?.distritos?.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Porción */}
          <div className="grid gap-2">
            <Label htmlFor="porcion">Porción</Label>
            <Select
              value={porcion}
              onValueChange={(v) => {
                setPorcion(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="porcion" className="h-12 w-full">
                <SelectValue placeholder="Porción" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="Todos">Todos</SelectItem>
                {filterData?.porciones?.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contratista */}
          <div className="grid gap-2">
            <Label htmlFor="contratista">Contratista</Label>
            <Select
              value={contratista}
              onValueChange={(v) => {
                setContratista(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="contratista" className="h-12 w-full">
                <SelectValue placeholder="Contratista" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="Todos">Todos</SelectItem>
                {filterData?.contratistas?.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="cursor-pointer px-4 py-2" onClick={handleSort}>
                Periodo {renderSortIcon()}
              </TableHead>
              <TableHead className="px-4 py-2">Distrito</TableHead>
              <TableHead className="px-4 py-2">Porción</TableHead>
              <TableHead className="px-4 py-2">Contratista</TableHead>
              <TableHead className="px-4 py-2">Filas Válidas</TableHead>
              <TableHead className="px-4 py-2">Filas Inválidas</TableHead>
              <TableHead className="px-4 py-2">Total</TableHead>
              <TableHead className="px-4 py-2">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((item) => (
                <TableRow key={item.idLote}>
                  <TableCell>{item.periodo}</TableCell>
                  <TableCell>{item.distrito ?? "—"}</TableCell>
                  <TableCell>{item.porcion ?? "—"}</TableCell>
                  <TableCell>{item.contratista}</TableCell>
                  <TableCell>{item.filasValidas}</TableCell>
                  <TableCell>{item.filasInvalidas}</TableCell>
                  <TableCell>{item.filasTotal}</TableCell>
                  <TableCell>{item.estado}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-4">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <PaginationBar
        total={total}
        page={page}
        onPageChange={setPage}
        isLoading={loading}
        className="mt-2"
      />
    </div>
  );
};

export default ReceiptListPage;
