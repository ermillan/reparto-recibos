import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
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
import { ArrowDown, ArrowUp } from "lucide-react";
import PaginationBar from "@/components/common/PaginationBar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/hooks/use-auth";
import { useAppSelector } from "@/store/hooks";
import { selectPerPage } from "@/store/slices/tablePrefs.slice";
import { AssignmentApi } from "@/infrastructure/services/recibos.api";
import type { AssignmentItem, FiltersAssignmentResult } from "@/domain/assignment/assignmen.types";

const assignmentApi = new AssignmentApi();

const ReceiptListPage = () => {
  const { user } = useAuth();
  const perPage = useAppSelector(selectPerPage);

  // 🔹 Estados de filtros
  const [periodo, setPeriodo] = useState("Todos");
  const [provincia, setProvincia] = useState("Todos");
  const [distrito, setDistrito] = useState("Todos");
  const [porcion, setPorcion] = useState("Todos");
  const [contratista, setContratista] = useState("Todos");

  // 🔹 Estados de datos
  const [filterData, setFilterData] = useState<FiltersAssignmentResult | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [rows, setRows] = useState<AssignmentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortDesc, setSortDesc] = useState(true);
  const [loading, setLoading] = useState(false);

  const uid = Number(user?.id ?? 0);

  // ======================================================
  // 🔹 Cargar filtros dinámicos
  // ======================================================
  const fetchFilters = useCallback(async () => {
    try {
      setLoadingFilters(true);
      const result = await assignmentApi.getFilters({
        uid,
        periodo: periodo !== "Todos" ? periodo : undefined,
        distrito: distrito !== "Todos" ? distrito : undefined,
        porcion: porcion !== "Todos" ? porcion : undefined,
      });
      setFilterData(result);
    } catch {
      toast.error("Error al cargar filtros");
    } finally {
      setLoadingFilters(false);
    }
  }, [uid, periodo, distrito, porcion]);

  // ======================================================
  // 🔹 Cargar asignaciones
  // ======================================================
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await assignmentApi.getAssignmentsPaginated({
        uid,
        periodo: periodo !== "Todos" ? periodo : undefined,
        provincia: provincia !== "Todos" ? provincia : undefined,
        distrito: distrito !== "Todos" ? distrito : undefined,
        porcion: porcion !== "Todos" ? porcion : undefined,
        contratista: contratista !== "Todos" ? contratista : undefined,
        page,
        pageSize: perPage,
      });

      setRows(result.items ?? []);
      setTotal(result.totalCount ?? 0);
    } catch {
      toast.error("Error al cargar los recibos");
    } finally {
      setLoading(false);
    }
  }, [uid, periodo, provincia, distrito, porcion, contratista, page, perPage]);

  // ======================================================
  // 🔹 Efectos
  // ======================================================
  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    if (filterData) fetchAssignments();
  }, [fetchAssignments, filterData]);

  // ======================================================
  // 🔹 Helpers UI
  // ======================================================
  const handleSort = () => setSortDesc((prev) => !prev);
  const renderSortIcon = () =>
    sortDesc ? (
      <ArrowDown className="inline h-4 w-4 ml-1" />
    ) : (
      <ArrowUp className="inline h-4 w-4 ml-1" />
    );

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const renderEstadoChip = (estado?: string | null) => {
    if (!estado) return <Badge variant="secondary">Sin estado</Badge>;

    const normalized = estado.toLowerCase();
    let color: "success" | "warning" | "destructive" | "secondary" = "secondary";

    switch (normalized) {
      case "confirmado":
      case "completado":
        color = "success";
        break;
      case "pendiente":
      case "en proceso":
        color = "warning";
        break;
      case "rechazado":
      case "error":
        color = "destructive";
        break;
    }

    const base = "text-xs font-semibold px-3 py-1 rounded-full capitalize";
    const styleMap: Record<string, string> = {
      success: "bg-emerald-100 text-emerald-700 border border-emerald-300",
      warning: "bg-amber-100 text-amber-700 border border-amber-300",
      destructive: "bg-rose-100 text-rose-700 border border-rose-300",
      secondary: "bg-slate-100 text-slate-700 border border-slate-300",
    };

    return <span className={`${base} ${styleMap[color]}`}>{estado}</span>;
  };

  // ======================================================
  // 🔹 Render principal
  // ======================================================
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-xl font-semibold text-primary">Lista de Recibos</h1>

      {/* ==================== FILTROS ==================== */}
      <div className="rounded-md border p-4 bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {filterData?.periodos?.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Provincia */}
          <div className="grid gap-2">
            <Label htmlFor="provincia">Provincia</Label>
            <Select
              value={provincia}
              onValueChange={(v) => {
                setProvincia(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="provincia" className="h-12 w-full">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {filterData?.provincias?.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
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
              <SelectContent>
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
              <SelectContent>
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
              <SelectContent>
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

      {/* ==================== TABLA ==================== */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary text-white">
            <TableRow>
              <TableHead onClick={handleSort} className="cursor-pointer">
                Periodo {renderSortIcon()}
              </TableHead>
              <TableHead>Unidad Lectura</TableHead>
              <TableHead>ID Lote</TableHead>
              <TableHead>Contratista</TableHead>
              <TableHead>Provincia</TableHead>
              <TableHead>Distrito</TableHead>
              <TableHead>Porción</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead>Repartidor</TableHead>
              <TableHead>Total Registros</TableHead>
              {/* <TableHead>Filas Válidas</TableHead>
              <TableHead>Filas Inválidas</TableHead> */}
              <TableHead>Fecha Asignación</TableHead>
              <TableHead>Fecha Máxima SLA</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-6">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((item, index) => (
                <TableRow key={`${item.idLote}-${index}`}>
                  <TableCell>{item.periodo}</TableCell>
                  <TableCell>{item.unidadLectura ?? "—"}</TableCell>
                  <TableCell>{item.idLote}</TableCell>
                  <TableCell>{item.contratista ?? "—"}</TableCell>
                  <TableCell>{item.provincia ?? "—"}</TableCell>
                  <TableCell>{item.distrito ?? "—"}</TableCell>
                  <TableCell>{item.porcion ?? "—"}</TableCell>
                  <TableCell>{item.ciclo ?? "—"}</TableCell>
                  <TableCell>{item.repartidor ?? "—"}</TableCell>
                  <TableCell>{item.totalRegistros}</TableCell>
                  {/* <TableCell>{item.filasValidas ?? 0}</TableCell>
                  <TableCell>{item.filasInvalidas ?? 0}</TableCell> */}
                  <TableCell>{formatDateTime(item.fechaAsignacion)}</TableCell>
                  <TableCell>{formatDateTime(item.fechaMaximaSLA)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-4 text-muted-foreground">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar total={total} page={page} onPageChange={setPage} isLoading={loading} />
    </div>
  );
};

export default ReceiptListPage;
