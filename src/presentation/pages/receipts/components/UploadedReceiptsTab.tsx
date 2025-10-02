import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ReceiptApi } from "@/infrastructure/services/recibos.api";

export default function UploadedReceiptsTab() {
  const api = new ReceiptApi();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);

  useEffect(() => {
    setLoadingReceipts(true);
    api
      .getReceiptsPaginated({ page: 1, pageSize: 20 })
      .then((res) => setReceipts(res.items || []))
      .catch(() => toast.error("Error al cargar archivos ❌"))
      .finally(() => setLoadingReceipts(false));
  }, []);

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-sky-600 text-left text-white">
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Periodo</th>
            <th className="px-3 py-2">Contratistas</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Inicio SLA</th>
            <th className="px-3 py-2">Fin SLA</th>
            <th className="px-3 py-2">Motivo Anulación</th>
            <th className="px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loadingReceipts ? (
            <tr>
              <td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">
                Cargando archivos...
              </td>
            </tr>
          ) : receipts.length > 0 ? (
            receipts.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">{r.periodo}</td>
                <td className="px-3 py-2">{r.contratistas}</td>
                <td className="px-3 py-2">
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
                </td>
                <td className="px-3 py-2">
                  {r.fechaInicioSLA ? new Date(r.fechaInicioSLA).toLocaleString() : "—"}
                </td>
                <td className="px-3 py-2">
                  {r.fechaFinSLA ? new Date(r.fechaFinSLA).toLocaleString() : "—"}
                </td>
                <td className="px-3 py-2">{r.motivoAnulacion || "—"}</td>
                <td className="px-3 py-2">
                  <button className="p-1 rounded hover:bg-red-50 text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">
                No hay archivos cargados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
