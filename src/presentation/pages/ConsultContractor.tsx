import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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

const mockUsers = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  username: [
    "vfernandez",
    "mramirez",
    "ctorres",
    "lherrera",
    "mgonzalez",
    "jperez",
    "dvargas",
    "mruiz",
    "ocastillo",
  ][i % 9],
  name: [
    "Valeria Fernández Gómez",
    "Mateo Ramírez López",
    "Camila Torres Rivas",
    "Lucas Herrera Salazar",
    "María González",
    "Juan Pérez",
    "Diego Vargas",
    "Marcela Ruiz",
    "Oscar Castillo",
  ][i % 9],
  profile: ["Contratista", "Soporte de aplicaciones", "Repartidor"][i % 3],
  contractor: ["Cobra", "Lari", "Bureau", "Dominon"][i % 4],
  status: "Activo",
}));

const ConsultContractor = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Activo");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // filtros
  const filteredUsers = mockUsers.filter((u) => {
    const matchesName = u.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesUser = u.username.toLowerCase().includes(userFilter.toLowerCase());
    const matchesContractor = contractorFilter === "Todos" || u.contractor === contractorFilter;
    const matchesStatus = statusFilter === "Todos" || u.status === statusFilter;
    return matchesName && matchesUser && matchesContractor && matchesStatus;
  });

  // paginación
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const startIndex = (page - 1) * perPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + perPage);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Consulta de Usuarios</h1>
        <Button asChild variant="ghost" className="flex items-center gap-2">
          <NavLink to="/seguridad/contratista/crear-contratista">
            <Plus className="h-4 w-4" />
            <span>Agregar</span>
          </NavLink>
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            placeholder="Nombre"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="usuario">Usuario</Label>
          <Input
            id="usuario"
            placeholder="Usuario"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contratista">Contratista</Label>
          <Select value={contractorFilter} onValueChange={setContractorFilter}>
            <SelectTrigger id="contratista">
              <SelectValue placeholder="Contratista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Cobra">Cobra</SelectItem>
              <SelectItem value="Lari">Lari</SelectItem>
              <SelectItem value="Bureau">Bureau</SelectItem>
              <SelectItem value="Dominon">Dominon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="estado">Estado</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="text-primary border-primary">
          Activar
        </Button>
        <Button variant="outline" className="text-red-600 border-red-600">
          Desactivar
        </Button>
        <Button variant="secondary" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Carga Masiva
        </Button>
      </div>

      {/* Tabla */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary text-white">
            <TableRow>
              <TableHead className="w-12 text-white">
                <Checkbox />
              </TableHead>
              <TableHead className="text-white">Usuario</TableHead>
              <TableHead className="text-white">Nombre</TableHead>
              <TableHead className="text-white">Perfil</TableHead>
              <TableHead className="text-white">Contratista</TableHead>
              <TableHead className="text-white">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <a href="#" className="text-primary hover:underline">
                      {user.username}
                    </a>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.profile}</TableCell>
                  <TableCell>{user.contractor}</TableCell>
                  <TableCell>{user.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
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
          <Select value={perPage.toString()} onValueChange={(val) => setPerPage(Number(val))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {startIndex + 1} – {Math.min(startIndex + perPage, filteredUsers.length)} de{" "}
            {filteredUsers.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
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
