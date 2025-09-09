import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Search,
  Plus,
  Printer,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { UserApi } from "@/infrastructure/services/user/user.api";
import { GetUserPaginated } from "@/application/user/getUserPaginated.usecase";
import { GetContractors } from "@/application/contractor/getContractors.usecase";
import { ContractorApi } from "@/infrastructure/services/contractor/contractor.api";

// ========= Instancias de API / UC =========
const userApi = new UserApi();
const contractorApi = new ContractorApi();

const getUserPaginated = new GetUserPaginated(userApi);
const getContractors = new GetContractors(contractorApi);

type Contractor = { id: number; nombre: string; activo: boolean };

type UserRow = {
  id: number;
  codigo: string;
  login: string;
  nombreCompleto: string;
  email: string;
  numeroDocumento: string;
  idTipoDocumento: number;
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

  // ===== Paginación (server) =====
  const [page, setPage] = useState(1); // Page (1-based)
  const [perPage, setPerPage] = useState(20); // Size

  // ===== Datos / UI =====
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0); // total del backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contratistas
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loadingContractors, setLoadingContractors] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = Math.min(page * perPage, total);

  // Si "Todos" -> enviar vacío ""; si no, enviar el id como number
  const idContratistaParam = useMemo<"" | number>(() => {
    return contractorFilter === "Todos" ? "" : Number(contractorFilter);
  }, [contractorFilter]);

  // Cargar contratistas para el select
  const fetchContractors = useCallback(async () => {
    try {
      setLoadingContractors(true);
      const list = await getContractors.execute(); // retorna Contractor[]
      const ordered = (list ?? [])
        .filter((c: Contractor) => c.activo)
        .sort((a: Contractor, b: Contractor) => a.nombre.localeCompare(b.nombre));
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
      const query = {
        Page: page,
        Size: perPage,
        Login: userFilter.trim() || "",
        Nombre: nameFilter.trim() || "",
        Codigo: "",
        NumeroDocumento: documentFilter.trim() || "",
        Activo: statusFilter === "Activo",
        IdContratista: idContratistaParam, // "" cuando "Todos"
        SortBy: sortBy,
        Desc: sortDesc,
      };

      const resp = await getUserPaginated.execute(query as any);
      setRows(resp.items ?? []);
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
    perPage,
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

  // Helpers paginación
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Reset rápido de filtros
  const resetFilters = () => {
    setNameFilter("");
    setUserFilter("");
    setDocumentFilter("");
    setContractorFilter("Todos");
    setStatusFilter("Activo");
    setSortBy("Login");
    setSortDesc(true);
    setPage(1);
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
                // Igualar el ancho al trigger y permitir que “se expanda” en alto
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

        {/* Acciones filtros */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            className="h-12 w-full sm:w-auto"
            onClick={() => {
              setPage(1);
              fetchUsers();
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline" className="h-12 w-full sm:w-auto" onClick={resetFilters}>
            Limpiar
          </Button>
          <div className="flex-1" />
          <Button variant="outline" className="h-12 w-full sm:w-auto">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button className="h-12 w-full sm:w-auto">
            <Upload className="h-4 w-4 mr-2" />
            Carga Masiva
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary text-white">
            <TableRow>
              <TableHead className="text-white">Usuario</TableHead>
              <TableHead className="text-white">Nombre</TableHead>
              <TableHead className="text-white hidden md:table-cell">Email</TableHead>
              <TableHead className="text-white hidden md:table-cell">Código</TableHead>
              <TableHead className="text-white">Documento</TableHead>
              <TableHead className="text-white">Estado</TableHead>
              <TableHead className="text-white hidden lg:table-cell">Bloqueado</TableHead>
              <TableHead className="text-white hidden lg:table-cell">Primera Vez</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-destructive">
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
                  <TableCell className="hidden md:table-cell">{u.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{u.codigo}</TableCell>
                  <TableCell>{u.numeroDocumento}</TableCell>
                  <TableCell>{u.activo ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {u.bloqueado ? "Bloqueado" : "No"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {u.primeraVez ? "Sí" : "No"}
                  </TableCell>
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Items por página:</span>
          <Select
            value={String(perPage)}
            onValueChange={(val) => {
              const n = Number(val);
              setPerPage(n);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[96px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-[--radix-select-trigger-width]">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">
            {total === 0 ? 0 : startIndex} – {endIndex} de {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setPage(1)}
              disabled={!canPrev || loading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!canNext || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setPage(totalPages)}
              disabled={!canNext || loading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultContractor;
