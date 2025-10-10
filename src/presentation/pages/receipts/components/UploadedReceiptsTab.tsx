import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import PaginationBar from "@/components/common/PaginationBar";

// Dialog confirmación
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { ReceiptApi } from "@/infrastructure/services/recibos.api";
import { useAppSelector } from "@/store/hooks";
import { selectPerPage } from "@/store/slices/tablePrefs.slice";

// shadcn textarea
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ROWS_SKELETON = 4;

const SkeletonTable = () => (
  <div className="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader className="bg-primary">
        <TableRow>
          <TableHead className="text-white">ID</TableHead>
          <TableHead className="text-white">Periodo</TableHead>
          <TableHead className="text-white">Contratistas</TableHead>
          <TableHead className="text-white">Estado</TableHead>
          <TableHead className="text-white">Inicio SLA</TableHead>
          <TableHead className="text-white">Fin SLA</TableHead>
          <TableHead className="text-white">Motivo Anulación</TableHead>
          <TableHead className="text-white">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: ROWS_SKELETON }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: 8 }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default function UploadedReceiptsTab() {
  const api = new ReceiptApi();

  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = useAppSelector(selectPerPage); // Redux perPage global

  // Modal
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reason, setReason] = useState(""); // motivo de anulación

  // Carga
  const fetchReceipts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getReceiptsPaginated({ page, pageSize: perPage });
      setReceipts(res.items || []);
      setTotal(res.meta?.total ?? 0);
    } catch {
      setError("Error al cargar archivos");
      toast.error("Error al cargar archivos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [page, perPage]);

  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setReason(""); // reset motivo
    setOpenConfirm(true);
  };

  const proceedDelete = async () => {
    if (!selectedId) return;

    try {
      await toast.promise(api.cancelReceipt(selectedId, reason), {
        loading: "Anulando recibo...",
        success: "Recibo anulado correctamente",
        error: (err) => err?.response?.data?.message || "Error desconocido al anular el recibo",
      });

      // cerrar modal
      setOpenConfirm(false);
      setSelectedId(null);
      setReason("");

      // refrescar tabla
      fetchReceipts();
    } catch (err) {
      console.error("Error al anular recibo", err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-primary">Archivos Cargados</h2>

      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white">ID</TableHead>
                <TableHead className="text-white">Periodo</TableHead>
                <TableHead className="text-white">Contratistas</TableHead>
                <TableHead className="text-white">Estado</TableHead>
                <TableHead className="text-white">Inicio SLA</TableHead>
                <TableHead className="text-white">Fin SLA</TableHead>
                <TableHead className="text-white">Motivo Anulación</TableHead>
                <TableHead className="text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : receipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                    No hay archivos cargados.
                  </TableCell>
                </TableRow>
              ) : (
                receipts.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.periodo}</TableCell>
                    <TableCell>{r.contratistas}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded text-white ${
                          r.estado === "ConErrores"
                            ? "bg-red-600"
                            : r.estado === "Cancelado"
                              ? "bg-gray-500"
                              : "bg-emerald-600"
                        }`}
                      >
                        {r.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      {r.fechaInicioSLA ? new Date(r.fechaInicioSLA).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>
                      {r.fechaFinSLA ? new Date(r.fechaFinSLA).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>{r.motivoAnulacion || "—"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => confirmDelete(r.id)}
                        className="transition-colors ease-in-out duration-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Paginación */}
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
            <DialogTitle>¿Está seguro de anular este recibo?</DialogTitle>
          </DialogHeader>

          {/* Campo para motivo */}
          <div className="space-y-2 py-2">
            <Label htmlFor="reason" className="text-sm">
              Ingrese motivo para la anulación
            </Label>
            <Textarea
              id="reason"
              placeholder="Escriba el motivo..."
              value={reason}
              maxLength={50}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
            <Label>{reason.length} / 50 caracteres.</Label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
              Cancelar
            </Button>
            <Button onClick={proceedDelete} disabled={!reason.trim()}>
              Sí, anular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
