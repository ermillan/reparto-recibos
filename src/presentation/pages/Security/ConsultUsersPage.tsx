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
  Plus,
  PenIcon,
  Trash2,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

// UC (Application Layer)
import { DeleteUser, GetUsersPaginated } from "@/application/users";
import { GetContractors } from "@/application/contractor";
import { GetProfiles } from "@/application/profiles";

// Dominio (Domain Layer)
import type { ContractorItem } from "@/domain/contractors/contractor.type";
import type { UsersQuery } from "@/domain/users/user.types";
import type { ProfileItem } from "@/domain/profile/profile.type";

// Infraestructura (Infrastructure Layer)
import { ContractorApi, UserApi, ProfileApi } from "@/infrastructure/services/recibos.api";

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

// Instancias de APIs y casos de uso
const userApi = new UserApi();
const contractorApi = new ContractorApi();
const profileApi = new ProfileApi();

const getUserPaginated = new GetUsersPaginated(userApi);
const getContractors = new GetContractors(contractorApi);
const getProfiles = new GetProfiles(profileApi);
const deleteUser = new DeleteUser(userApi);

// Tipo de fila de usuario
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
  perfiles: string;
  contratistas: string; // puede venir como string o id según tu API
};

// Campos ordenables
type SortField =
  | "Login"
  | "Nombre"
  | "Codigo"
  | "NumeroDocumento"
  | "Email"
  | "Estado"
  | "Contratista"
  | "Id"
  | "Perfil";

const ConsultUsersPage = () => {
  // Filtros
  const [nameFilter, setNameFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [documentFilter, setDocumentFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("Todos");
  const [profileFilter, setProfileFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState<"Activo" | "Inactivo" | "Todos">("Activo");

  // Orden
  const [sortBy, setSortBy] = useState<SortField>("Id");
  const [sortDesc, setSortDesc] = useState(true);

  // Paginación
  const [page, setPage] = useState(1);
  const perPage = useAppSelector(selectPerPage);

  // Datos de usuarios
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos de contratistas
  const [contractors, setContractors] = useState<ContractorItem[]>([]);
  const [loadingContractors, setLoadingContractors] = useState(false);

  // Datos de perfiles
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Modal confirmación
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // Param IdContratista
  const idContratistaParam = useMemo<number | undefined>(() => {
    return contractorFilter === "Todos" ? undefined : Number(contractorFilter);
  }, [contractorFilter]);

  // Param IdPerfil
  const idPerfilParam = useMemo<number | undefined>(() => {
    return profileFilter === "Todos" ? undefined : Number(profileFilter);
  }, [profileFilter]);

  // Fetch contratistas
  const fetchContractors = useCallback(async () => {
    try {
      setLoadingContractors(true);
      const list = await getContractors.exec({ Activo: true });
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

  // Fetch perfiles
  const fetchProfiles = useCallback(async () => {
    try {
      setLoadingProfiles(true);
      const list = await getProfiles.exec({ Activo: true });
      setProfiles(list ?? []);
    } catch (e) {
      console.error("No se pudieron cargar perfiles", e);
      setProfiles([]);
    } finally {
      setLoadingProfiles(false);
    }
  }, []);

  // Fetch usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: UsersQuery = {
        Page: page,
        Size: perPage,
        Login: userFilter.trim() || undefined,
        Nombre: nameFilter.trim() || undefined,
        NumeroDocumento: documentFilter.trim() || undefined,
        Activo: statusFilter === "Todos" ? undefined : statusFilter === "Activo",
        IdContratista: idContratistaParam,
        IdPerfil: idPerfilParam,
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
    perPage,
    userFilter,
    nameFilter,
    documentFilter,
    statusFilter,
    idContratistaParam,
    idPerfilParam,
    sortBy,
    sortDesc,
  ]);

  // Hooks iniciales
  useEffect(() => {
    fetchContractors();
    fetchProfiles();
  }, [fetchContractors, fetchProfiles]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Eliminar usuario
  const handleDeleteUser = async (id: number) => {
    const promise = deleteUser.exec(id);
    await toast.promise(promise, {
      loading: "Eliminando usuario...",
      success: "¡Usuario eliminado correctamente!",
      error: "Error en el servidor.",
    });

    setPage((p) => (rows.length === 1 && p > 1 ? p - 1 : p));
    fetchUsers();
  };

  const confirmDeleteUser = (user: UserRow) => {
    setSelectedUser(user);
    setOpenConfirm(true);
  };

  const proceedDelete = async () => {
    if (selectedUser) {
      await handleDeleteUser(selectedUser.id);
      setSelectedUser(null);
      setOpenConfirm(false);
    }
  };

  // Ordenamiento
  const handleSortClick = (field: SortField) => {
    if (sortBy === field) {
      setSortDesc((prev) => !prev);
    } else {
      setSortBy(field);
      setSortDesc(false);
    }
    setPage(1);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortBy === field) {
      return sortDesc ? (
        <ArrowDown className="inline h-4 w-4 ml-1" />
      ) : (
        <ArrowUp className="inline h-4 w-4 ml-1" />
      );
    }
    return <ArrowUp className="inline h-4 w-4 ml-1 opacity-50" />;
  };

  const renderHeaderClass = (field: SortField) => {
    const base = "cursor-pointer select-none px-4 py-2";
    return sortBy === field ? `${base} bg-primary/70 font-semibold` : base;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Consulta de Usuarios</h1>
        <div className="flex gap-2 w-full sm:w-auto justify-center">
          <Button asChild variant="ghost" className="justify-center gap-2">
            <NavLink to="/seguridad/usuarios/crear-usuario">
              <Plus className="h-4 w-4" />
              <span>Crear Usuario</span>
            </NavLink>
          </Button>
          <Button
            variant="ghost"
            className="justify-center gap-2"
            onClick={() => {
              setNameFilter("");
              setUserFilter("");
              setDocumentFilter("");
              setContractorFilter("Todos");
              setProfileFilter("Todos");
              setStatusFilter("Activo");
              setPage(1);
              fetchUsers();
            }}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>

          {/* Botón Descargar Excel */}
          <div className="w-full h-full flex items-center justify-center">
            <a
              href={`/`}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Descargar
            </a>
          </div>
        </div>
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
              <SelectContent className="max-h-64 overflow-auto">
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
              onValueChange={(v: "Activo" | "Inactivo" | "Todos") => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="estado" className="h-12 w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Perfil */}
          <div className="grid gap-2">
            <Label htmlFor="perfil">Perfil</Label>
            <Select
              value={profileFilter}
              onValueChange={(v) => {
                setProfileFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger id="perfil" className="h-12 w-full">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="Todos">Todos</SelectItem>
                {loadingProfiles ? (
                  <SelectItem value="__loading" disabled>
                    Cargando...
                  </SelectItem>
                ) : profiles.length === 0 ? (
                  <SelectItem value="__empty" disabled>
                    Sin perfiles
                  </SelectItem>
                ) : (
                  profiles.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nombre}
                    </SelectItem>
                  ))
                )}
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
              <TableHead
                className={renderHeaderClass("Login")}
                onClick={() => handleSortClick("Login")}
              >
                Usuario {renderSortIcon("Login")}
              </TableHead>
              <TableHead
                className={renderHeaderClass("Nombre")}
                onClick={() => handleSortClick("Nombre")}
              >
                Nombre {renderSortIcon("Nombre")}
              </TableHead>
              <TableHead
                className={renderHeaderClass("Email")}
                onClick={() => handleSortClick("Email")}
              >
                Email {renderSortIcon("Email")}
              </TableHead>
              <TableHead
                className={renderHeaderClass("Codigo")}
                onClick={() => handleSortClick("Codigo")}
              >
                Código {renderSortIcon("Codigo")}
              </TableHead>
              <TableHead
                className={renderHeaderClass("NumeroDocumento")}
                onClick={() => handleSortClick("NumeroDocumento")}
              >
                Documento {renderSortIcon("NumeroDocumento")}
              </TableHead>
              <TableHead
                className={renderHeaderClass("Estado")}
                onClick={() => handleSortClick("Estado")}
              >
                Estado {renderSortIcon("Estado")}
              </TableHead>
              <TableHead
                className={renderHeaderClass("Contratista")}
                onClick={() => handleSortClick("Contratista")}
              >
                Contratista {renderSortIcon("Contratista")}
              </TableHead>
              <TableHead
                className={renderHeaderClass("Perfil")}
                onClick={() => handleSortClick("Perfil")}
              >
                Perfil {renderSortIcon("Perfil")}
              </TableHead>
              <TableHead className="text-white px-4 py-2">Acciones</TableHead>
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
                  <TableCell className="max-w-[160px] truncate">{u.login}</TableCell>
                  <TableCell className="max-w-[220px] truncate">{u.nombreCompleto}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.codigo}</TableCell>
                  <TableCell>{u.numeroDocumento}</TableCell>
                  <TableCell>{u.activo ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>
                    {contractors.find((c) => c.id === Number(u.contratistas))?.nombre ??
                      u.contratistas ??
                      "—"}
                  </TableCell>
                  <TableCell>{u.perfiles}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <Button
                        variant="outline"
                        aria-label="Editar Usuario"
                        className="transition-colors ease-in-out duration-300 hover:bg-green-50 hover:text-green-700"
                        asChild
                      >
                        <NavLink to={`/seguridad/usuarios/actualizar-usuario/${u.id}`}>
                          <PenIcon className="h-4 w-4" />
                        </NavLink>
                      </Button>
                      <Button
                        variant="outline"
                        aria-label="Eliminar Usuario"
                        onClick={() => confirmDeleteUser(u)}
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
            <DialogTitle>¿Está seguro de eliminar este usuario?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {selectedUser
              ? `El usuario "${selectedUser.nombreCompleto}" (${selectedUser.login}) será eliminado permanentemente.`
              : "Esta acción no se puede deshacer."}
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

export default ConsultUsersPage;
