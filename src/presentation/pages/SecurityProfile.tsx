import { useState, useMemo } from "react";
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
import { Search, Plus, Printer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NavLink } from "react-router-dom";

// Datos simulados (puedes reemplazar con fetch a API)
const profilesData = [
  { code: "PER001", role: "Soporte de aplicaciones", status: "Activo" },
  { code: "PER002", role: "Supervisor calidad", status: "Activo" },
  { code: "PER003", role: "Contratista", status: "Activo" },
  { code: "PER004", role: "Repartidor", status: "Inactivo" },
  { code: "PER005", role: "Analista de datos e información", status: "Activo" },
];

const SecurityProfile = () => {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("all");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Filtrado con useMemo para optimizar
  const filteredProfiles = useMemo(() => {
    return profilesData.filter((profile) => {
      const matchesDescription = profile.role.toLowerCase().includes(description.toLowerCase());

      const matchesStatus = status === "all" || profile.status.toLowerCase() === status;

      return matchesDescription && matchesStatus;
    });
  }, [description, status]);

  const handleSearch = () => {
    setSearchTriggered(true);
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

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Descripción */}
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
            Descripción
          </Label>
          <Input
            type="text"
            id="description"
            name="description"
            placeholder="Buscar por rol..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Estado */}
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="estado" className="text-sm font-medium text-muted-foreground">
            Estado
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Acciones */}
        <div className="flex items-end gap-2 sm:col-span-2 md:col-span-1">
          <Button variant="secondary" className="flex-1 sm:flex-initial" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Buscar</span>
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-initial">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="w-12 text-white"></TableHead>
              <TableHead className="text-white">Código</TableHead>
              <TableHead className="text-white">Descripción Rol</TableHead>
              <TableHead className="text-white">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchTriggered && filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((item) => (
                <TableRow key={item.code}>
                  <TableCell>
                    <input type="checkbox" className="accent-primary" />
                  </TableCell>
                  <TableCell>
                    <a href="#" className="text-primary hover:underline font-medium">
                      {item.code}
                    </a>
                  </TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SecurityProfile;
