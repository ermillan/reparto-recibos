// src/pages/security/users/ConsultContractor.tsx
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
import { Plus, PenIcon, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

// UC
import { DeleteUser, GetUsersPaginated } from "@/application/users";
import { GetContractors } from "@/application/contractor";

// Dominio
import type { ContractorItem } from "@/domain/contractors/contractor.type";
import type { UsersQuery } from "@/domain/users/user.types";
import { ContractorApi, UserApi } from "@/infrastructure/services/recibos.api";

// PaginationBar + Redux perPage
import PaginationBar from "@/components/common/PaginationBar";
import { useAppSelector } from "@/store/hooks";
// ⬇️ ajusta este import si tu slice está en otra ruta
import { selectPerPage } from "@/store/slices/tablePrefs.slice";

const userApi = new UserApi();
const contractorApi = new ContractorApi();

const getUserPaginated = new GetUsersPaginated(userApi);
const getContractors = new GetContractors(contractorApi);
const deleteUser = new DeleteUser(userApi);

type UserRow = {
  id: number;
  codigo: string;
  login: string;
  nombreCompleto: string;
  email: string;
  numeroDocumento: string;
  idTipoDocumento?: number | null;
  activo: boolean;
  bloqueado: boolean;
  primeraVez: boolean;
};

const ConsultContractor = () => {
  // ===== Filtros =====
  const [nameFilter, setNameFilter] = useState(""); // -> Nombre
  const [userFilter, setUserFilter] = useState(""); // -> Login
  const [documentFilter, setDocumentFilter] = useState(""); // -> NumeroDocumento
  const [contractorFilter, setContractorFilter] = useState("Todos"); // -> IdContratista ("Todos" | "<id>")
  const [statusFilter, setStatusFilter] = useState<"Activo" | "Inactivo">("Activo"); // Activo por default

  // ===== Orden =====
  const [sortBy, setSortBy] = useState<"Login" | "Nombre" | "Codigo" | "NumeroDocumento">("Login");
  const [sortDesc, setSortDesc] = useState(true);

  // ===== Paginación =====
  const [page, setPage] = useState(1); // Page (1-based)
  const perPage = useAppSelector(selectPerPage); // <- desde Redux

  // ===== Datos / UI =====
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0); // total del backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contratistas
  const [contractors, setContractors] = useState<ContractorItem[]>([]);
  const [loadingContractors, setLoadingContractors] = useState(false);

  // ✅ Si "Todos" → undefined; si no → number
  const idContratistaParam = useMemo<number | undefined>(() => {
    return contractorFilter === "Todos" ? undefined : Number(contractorFilter);
  }, [contractorFilter]);

  // Cargar contratistas para el select
  const fetchContractors = useCallback(async () => {
    try {
      setLoadingContractors(true);
      const list = await getContractors.exec({ Activo: true }); // retorna Contractor[]
      const ordered = (list ?? [])
        .filter((c: ContractorItem) => c.activo)
        .sort((a: ContractorItem, b: ContractorItem) =>
          (a.nombre ?? "").localeCompare(b.nombre ?? "")
        );
      setContractors(ordered);
    } catch (e) {
      console.error("No se pudieron cargar contratistas", e);
      setContractors([]);
    } finally {
      setLoadingContractors(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: UsersQuery = {
        Page: page,
        Size: perPage, // <- viene de Redux
        Login: userFilter.trim() || undefined,
        Nombre: nameFilter.trim() || undefined,
        Codigo: undefined,
        NumeroDocumento: documentFilter.trim() || undefined,
        Activo: statusFilter === "Activo",
        IdContratista: idContratistaParam,
        SortBy: sortBy,
        Desc: sortDesc,
      };

      const resp = await getUserPaginated.exec(query);
      setRows((resp.items ?? []) as UserRow[]);
      setTotal(resp.meta?.total ?? 0);
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.title ||
          e?.response?.data?.message ||
          e?.message ||
          "No se pudo cargar la lista de usuarios."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    perPage, // <- cuando cambie globalmente, se vuelve a pedir
    userFilter,
    nameFilter,
    documentFilter,
    statusFilter,
    idContratistaParam,
    sortBy,
    sortDesc,
  ]);

  // Cargar contratistas una sola vez
  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);

  // Cargar usuarios cuando cambien filtros/paginación/orden
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (id: number) => {
    const promise = deleteUser.exec(id);
    await toast.promise(promise, {
      loading: "Eliminando usuario...",
      success: "¡Usuario eliminado correctamente!",
      error: "Error en el servidor.",
    });

    // si eliminaste el último de la página, retrocede una página
    setPage((p) => (rows.length === 1 && p > 1 ? p - 1 : p));
    fetchUsers();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Consulta de Usuarios</h1>
        <Button asChild variant="ghost" className="w-full sm:w-auto justify-center gap-2">
          <NavLink to="/seguridad/contratista/crear-contratista">
            <Plus className="h-4 w-4" />
            <span>Agregar</span>
          </NavLink>
        </Button>
      </div>

      {/* Filtros */}
      <div className="rounded-md border p-4 md:p-5 bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre"
              value={nameFilter}
              onChange={(e) => {
                setNameFilter(e.target.value);
                setPage(1);
              }}
              className="h-12"
            />
          </div>

          {/* Usuario */}
          <div className="grid gap-2">
            <Label htmlFor="usuario">Usuario</Label>
            <Input
              id="usuario"
              placeholder="Usuario"
              value={userFilter}
              onChange={(e) => {
                setUserFilter(e.target.value);
                setPage(1);
              }}
              className="h-12"
            />
          </div>

          {/* Documento */}
          <div className="grid gap-2">
            <Label htmlFor="documento">Documento</Label>
            <Input
              id="documento"
              placeholder="N° de documento"
              value={documentFilter}
              onChange={(e) => {
                setDocumentFilter(e.target.value);
                setPage(1);
              }}
              className="h-12"
            />
          </div>

          {/* Contratista */}
          <div className="grid gap-2">
            <Label htmlFor="contratista">Contratista</Label>
            <Select
              value={contractorFilter}
              onValueChange={(v) => {
                setContractorFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="contratista" className="h-12 w-full">
                <SelectValue placeholder="Contratista" />
              </SelectTrigger>
              <SelectContent
                className="w-[--radix-select-trigger-width] max-h-64 overflow-auto"
                position="popper"
                side="bottom"
                align="start"
              >
                <SelectItem value="Todos">Todos</SelectItem>
                {loadingContractors ? (
                  <SelectItem value="__loading" disabled>
                    Cargando...
                  </SelectItem>
                ) : contractors.length === 0 ? (
                  <SelectItem value="__empty" disabled>
                    Sin contratistas
                  </SelectItem>
                ) : (
                  contractors.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nombre}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={statusFilter}
              onValueChange={(v: "Activo" | "Inactivo") => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="estado" className="h-12 w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="w-[--radix-select-trigger-width] max-h-64 overflow-auto">
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orden */}
          <div className="grid gap-2">
            <Label htmlFor="orden">Orden</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={sortBy}
                onValueChange={(v: "Login" | "Nombre" | "Codigo" | "NumeroDocumento") => {
                  setSortBy(v);
                  setPage(1);
                }}
              >
                <SelectTrigger id="orden" className="h-12 w-full sm:w-1/2">
                  <SelectValue placeholder="Campo" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width] max-h-64 overflow-auto">
                  <SelectItem value="Login">Usuario</SelectItem>
                  <SelectItem value="Nombre">Nombre</SelectItem>
                  <SelectItem value="Codigo">Código</SelectItem>
                  <SelectItem value="NumeroDocumento">Documento</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortDesc ? "desc" : "asc"}
                onValueChange={(v: "asc" | "desc") => {
                  setSortDesc(v === "desc");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-12 w-full sm:w-1/2">
                  <SelectValue placeholder="Dirección" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width] max-h-64 overflow-auto">
                  <SelectItem value="asc">Asc</SelectItem>
                  <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary text-white">
            <TableRow>
              <TableHead className="text-white">Usuario</TableHead>
              <TableHead className="text-white">Nombre</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Código</TableHead>
              <TableHead className="text-white">Documento</TableHead>
              <TableHead className="text-white">Estado</TableHead>
              <TableHead className="text-white">Bloqueado</TableHead>
              <TableHead className="text-white">Primera Vez</TableHead>
              <TableHead className="text-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="py-6 text-center text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} className="py-6 text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="max-w-[160px] truncate">
                    <a href="#" className="text-primary hover:underline">
                      {u.login}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">{u.nombreCompleto}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.codigo}</TableCell>
                  <TableCell>{u.numeroDocumento}</TableCell>
                  <TableCell>{u.activo ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>{u.bloqueado ? "Bloqueado" : "No"}</TableCell>
                  <TableCell>{u.primeraVez ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <Button
                        variant="outline"
                        aria-label="Editar Usuario"
                        className="transition-colors ease-in-out duration-300 hover:bg-green-50 hover:text-green-700"
                        asChild
                      >
                        <NavLink to={`/seguridad/contratista/actualizar-contratista/${u.id}`}>
                          <PenIcon className="h-4 w-4" />
                        </NavLink>
                      </Button>
                      <Button
                        variant="outline"
                        aria-label="Eliminar Usuario"
                        onClick={() => handleDeleteUser(u.id)}
                        className="transition-colors ease-in-out duration-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-4">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación (reutilizable) */}
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

export default ConsultContractor;
