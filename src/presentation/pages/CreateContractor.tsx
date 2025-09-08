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
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Reglas de validación (regex)
const regex = {
  nombre: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, // solo letras, 2-40 chars
  usuario: /^[a-zA-Z0-9_]{4,16}$/, // letras, números, guión bajo
  documento: /^[0-9]{8}$/, // 8 dígitos
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // formato email
  celular: /^[0-9]{9}$/, // 9 dígitos
};

const CreateContractor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    usuario: "",
    documento: "",
    email: "",
    celular: "",
    direccion: "",
    estado: "Activo",
    perfil: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    if (regex[name as keyof typeof regex]) {
      if (!regex[name as keyof typeof regex].test(value)) {
        error = "Formato inválido";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSave = () => {
    console.log("Guardando usuario:", form);
    // Aquí conectas con tu API
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Registrar Usuario</h1>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>
      </div>

      {/* Formulario */}
      <div className="rounded-md border p-6 bg-card shadow-sm">
        <h2 className="text-sm font-semibold text-primary mb-4">Datos Generales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="nombre">Ingrese el nombre *</Label>
            <Input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan"
            />
            {errors.nombre && <span className="text-xs text-red-500">{errors.nombre}</span>}
          </div>

          {/* Apellido Paterno */}
          <div className="grid gap-2">
            <Label htmlFor="apellidoPaterno">Ingrese el apellido paterno *</Label>
            <Input
              id="apellidoPaterno"
              name="apellidoPaterno"
              value={form.apellidoPaterno}
              onChange={handleChange}
              placeholder="Ej: Pérez"
            />
          </div>

          {/* Apellido Materno */}
          <div className="grid gap-2">
            <Label htmlFor="apellidoMaterno">Ingrese el apellido materno *</Label>
            <Input
              id="apellidoMaterno"
              name="apellidoMaterno"
              value={form.apellidoMaterno}
              onChange={handleChange}
              placeholder="Ej: Gómez"
            />
          </div>

          {/* Usuario */}
          <div className="grid gap-2">
            <Label htmlFor="usuario">Ingrese el usuario *</Label>
            <Input
              id="usuario"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="Ej: jgomez"
            />
            {errors.usuario && <span className="text-xs text-red-500">{errors.usuario}</span>}
          </div>

          {/* Documento */}
          <div className="grid gap-2">
            <Label htmlFor="documento">Ingrese el número de documento *</Label>
            <Input
              id="documento"
              name="documento"
              value={form.documento}
              onChange={handleChange}
              placeholder="Ej: 12345678"
            />
            {errors.documento && <span className="text-xs text-red-500">{errors.documento}</span>}
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Ingrese el correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ej: usuario@correo.com"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          {/* Celular */}
          <div className="grid gap-2">
            <Label htmlFor="celular">Ingrese el número de celular</Label>
            <Input
              id="celular"
              name="celular"
              value={form.celular}
              onChange={handleChange}
              placeholder="Ej: 987654321"
            />
            {errors.celular && <span className="text-xs text-red-500">{errors.celular}</span>}
          </div>

          {/* Dirección */}
          <div className="grid gap-2">
            <Label htmlFor="direccion">Ingrese la dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Ej: Av. Siempre Viva 742"
            />
          </div>

          {/* Estado */}
          <div className="grid gap-2">
            <Label htmlFor="estado">Seleccione el estado</Label>
            <Select
              value={form.estado}
              onValueChange={(val) => setForm((prev) => ({ ...prev, estado: val }))}
            >
              <SelectTrigger id="estado" className="w-full">
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Perfil */}
          <div className="grid gap-2">
            <Label htmlFor="perfil">Seleccione el perfil</Label>
            <Select
              value={form.perfil}
              onValueChange={(val) => setForm((prev) => ({ ...prev, perfil: val }))}
            >
              <SelectTrigger id="perfil" className="w-full">
                <SelectValue placeholder="Seleccione perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Soporte de aplicaciones">Soporte de aplicaciones</SelectItem>
                <SelectItem value="Contratista">Contratista</SelectItem>
                <SelectItem value="Repartidor">Repartidor</SelectItem>
              </SelectContent>
            </Select>
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

export default CreateContractor;
