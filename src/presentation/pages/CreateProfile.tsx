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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    repartidores: true,
    perfiles: true,
    contratistas: true,
    orden: true,
    seguimientoRepartidor: true,
    recibos: true,
    cargaRecibos: true,
    asignaciones: true,
    seguimientoEntregas: true,
    dashboard: true,
    seguimientoOrdenes: true,
  });

  const handleCheckboxChange = (key: string) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const profile = {
      description,
      status,
      permissions,
    };
    console.log("Guardando perfil:", profile);
    // Aquí iría el POST a tu API
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Edición de Perfiles</h1>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>
      </div>

      {/* Formulario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="rounded-md border p-4 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción *</Label>
            <Input
              id="description"
              placeholder="Ingrese la descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="estado" className="w-full">
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="rounded-md border p-4 space-y-4">
          <h2 className="font-semibold">Accesos</h2>

          {/* Sección Seguridad */}
          <div className="space-y-2">
            <div className="font-medium">Seguridad</div>
            <div className="pl-4 space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="repartidores"
                  checked={permissions.repartidores}
                  onCheckedChange={() => handleCheckboxChange("repartidores")}
                />
                <Label htmlFor="repartidores" className="cursor-pointer">
                  Repartidores
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="perfiles"
                  checked={permissions.perfiles}
                  onCheckedChange={() => handleCheckboxChange("perfiles")}
                />
                <Label htmlFor="perfiles" className="cursor-pointer">
                  Perfiles
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="contratistas"
                  checked={permissions.contratistas}
                  onCheckedChange={() => handleCheckboxChange("contratistas")}
                />
                <Label htmlFor="contratistas" className="cursor-pointer">
                  Contratistas y otros
                </Label>
              </div>
            </div>
          </div>

          {/* Sección Gestión de Recibos */}
          <div className="space-y-2">
            <div className="font-medium">Gestión de Recibos</div>
            <div className="pl-4 space-y-2">
              {[
                { key: "orden", label: "Orden de entrega" },
                { key: "seguimientoRepartidor", label: "Seguimiento repartidor" },
                { key: "recibos", label: "Recibos" },
                { key: "cargaRecibos", label: "Carga de Recibos" },
                { key: "asignaciones", label: "Asignaciones repartidor" },
                { key: "seguimientoEntregas", label: "Seguimiento de entregas" },
                { key: "dashboard", label: "Dashboard" },
                { key: "seguimientoOrdenes", label: "Seguimiento órdenes" },
              ].map((item) => (
                <div className="flex items-center gap-x-2 gap-y-6" key={item.key}>
                  <Checkbox
                    id={item.key}
                    checked={permissions[item.key as keyof typeof permissions]}
                    onCheckedChange={() => handleCheckboxChange(item.key)}
                  />
                  <Label htmlFor={item.key} className="cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default CreateProfile;
