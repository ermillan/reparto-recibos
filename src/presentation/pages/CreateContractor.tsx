import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// Hexagonal – UseCases
import { GetProfiles } from "@/application/profiles";
import { CreateUser, GetUserById, UpdateUser } from "@/application/users";
import { GetContractors } from "@/application/contractor";

// Tipos dominio
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserByIdResponse,
} from "@/domain/users/user.types";
import type { ContractorItem } from "@/domain/contractors/contractor.type";

// Infra repos (mantengo tu endpoint centralizado)
import { ContractorApi, ProfileApi, UserApi } from "@/infrastructure/services/recibos.api";

// Si tu dominio tiene un tipo explícito para items de perfil, úsalo.
// Aquí usamos un mínimo compatible:
type ProfileOption = { id: number; nombre?: string | null };

// Instancias
const userApi = new UserApi();
const contractorApi = new ContractorApi();
const profileApi = new ProfileApi();

const createUserUC = new CreateUser(userApi);
const getUserByIdUC = new GetUserById(userApi);
const updateUserUC = new UpdateUser(userApi);
const getContractorsUC = new GetContractors(contractorApi);
const getProfilesUC = new GetProfiles(profileApi);

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
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    usuario: "",
    documento: "",
    email: "",
    celular: "",
    direccion: "",
    estado: "Activo" as "Activo" | "Inactivo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Opciones desde backend
  const [contractors, setContractors] = useState<ContractorItem[]>([]);
  const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null);

  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  // Carga inicial: contratistas + perfiles + (si edita) usuario
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [contrs, profs, user] = await Promise.all([
          getContractorsUC.exec({ Activo: true }),
          getProfilesUC.exec({ activo: true }),
          isEdit && id ? getUserByIdUC.exec(Number(id)) : Promise.resolve(null),
        ]);

        // Contratistas
        setContractors(contrs ?? []);

        // Perfiles: asegurar {id, nombre}
        const profOpts = (profs ?? []).map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
        })) as ProfileOption[];
        setProfiles(profOpts);

        // Si estamos editando: precargar campos
        if (user) {
          preloadFromUser(user);
        }
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar datos iniciales.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id]);

  const preloadFromUser = (u: UserByIdResponse) => {
    setForm({
      nombre: u.nombre ?? "",
      apellidoPaterno: u.apellidoPaterno ?? "",
      apellidoMaterno: u.apellidoMaterno ?? "",
      usuario: u.login ?? "",
      documento: u.numeroDocumento ?? "",
      email: u.email ?? "",
      celular: u.celular ?? "",
      direccion: u.direccion ?? "",
      estado: u.activo ? "Activo" : "Inactivo",
    });

    // Perfil: usar idPerfilDefault si viene; si no, primer perfilIds
    const profileId =
      (u.idPerfilDefault as number | null | undefined) ??
      (Array.isArray(u.perfilIds) && u.perfilIds.length > 0 ? u.perfilIds[0] : null);
    setSelectedProfileId(profileId ?? null);

    // Contratista: si viene array, toma el primero (UI actual es single select)
    const contrId =
      Array.isArray(u.contratistaIds) && u.contratistaIds.length > 0 ? u.contratistaIds[0] : null;
    setSelectedContractorId(contrId ?? null);
  };

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

  const isInvalid = () => {
    if (!form.nombre.trim() || !form.apellidoPaterno.trim() || !form.usuario.trim()) return true;
    if (!regex.documento.test(form.documento)) return true;
    if (Object.values(errors).some(Boolean)) return true;
    return false;
  };

  const buildCreatePayload = (): CreateUserRequest => ({
    login: form.usuario || undefined,
    // Si tu backend exige password, agrega un campo en el form y pásalo aquí
    password: undefined,
    nombre: form.nombre || undefined,
    apellidoPaterno: form.apellidoPaterno || undefined,
    apellidoMaterno: form.apellidoMaterno || undefined,
    email: form.email || undefined,
    numeroDocumento: form.documento || undefined,
    idTipoDocumento: form.documento?.length === 8 ? 1 : undefined, // ajusta si difiere tu catálogo
    celular: form.celular || undefined,
    direccion: form.direccion || undefined,
    activo: form.estado === "Activo",
    perfilIds: selectedProfileId ? [selectedProfileId] : [],
    contratistaIds: selectedContractorId ? [selectedContractorId] : [],
  });

  const buildUpdatePayload = (): UpdateUserRequest => ({
    id: Number(id),
    login: form.usuario || undefined,
    nombre: form.nombre || undefined,
    apellidoPaterno: form.apellidoPaterno || undefined,
    apellidoMaterno: form.apellidoMaterno || undefined,
    email: form.email || undefined,
    numeroDocumento: form.documento || undefined,
    idTipoDocumento: form.documento?.length === 8 ? 1 : undefined,
    celular: form.celular || undefined,
    direccion: form.direccion || undefined,
    activo: form.estado === "Activo",
    perfilIds: selectedProfileId ? [selectedProfileId] : [],
    contratistaIds: selectedContractorId ? [selectedContractorId] : [],
  });

  const handleSave = async () => {
    if (isInvalid()) {
      toast.error("Revisa los campos obligatorios.");
      return;
    }

    try {
      setSaving(true);

      if (isEdit && id) {
        const payload = buildUpdatePayload();
        await toast.promise(updateUserUC.exec(payload), {
          loading: "Actualizando usuario...",
          success: "¡Usuario actualizado correctamente!",
          error: (err) =>
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            "Error en el servidor.",
        });
      } else {
        const payload = buildCreatePayload();
        await toast.promise(createUserUC.exec(payload), {
          loading: "Creando usuario...",
          success: "¡Usuario creado correctamente!",
          error: (err) =>
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            "Error en el servidor.",
        });
      }

      navigate(-1);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const headerTitle = isEdit ? `Actualizar Usuario` : "Registrar Usuario";
  const buttonLabel = isEdit ? "Actualizar" : "Guardar";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">{headerTitle}</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
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
              disabled={saving || loading}
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
              disabled={saving || loading}
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
              disabled={saving || loading}
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
              disabled={saving || loading}
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
              disabled={saving || loading}
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
              disabled={saving || loading}
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
              disabled={saving || loading}
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
              disabled={saving || loading}
            />
          </div>

          {/* Estado */}
          <div className="grid gap-2">
            <Label htmlFor="estado">Seleccione el estado</Label>
            <Select
              value={form.estado}
              onValueChange={(val: "Activo" | "Inactivo") =>
                setForm((prev) => ({ ...prev, estado: val }))
              }
              disabled={saving || loading}
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

          {/* Perfil (desde backend) */}
          <div className="grid gap-2">
            <Label htmlFor="perfil">Seleccione el perfil</Label>
            <Select
              value={selectedProfileId ? String(selectedProfileId) : ""}
              onValueChange={(val) => setSelectedProfileId(Number(val))}
              disabled={saving || loading || profiles.length === 0}
            >
              <SelectTrigger id="perfil" className="w-full">
                <SelectValue placeholder={loading ? "Cargando..." : "Seleccione perfil"} />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nombre ?? `Perfil #${p.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contratista (desde backend) */}
          <div className="grid gap-2">
            <Label htmlFor="contratista">Seleccione el contratista</Label>
            <Select
              value={selectedContractorId ? String(selectedContractorId) : ""}
              onValueChange={(val) => setSelectedContractorId(Number(val))}
              disabled={saving || loading || contractors.length === 0}
            >
              <SelectTrigger id="contratista" className="w-full">
                <SelectValue placeholder={loading ? "Cargando..." : "Seleccione contratista"} />
              </SelectTrigger>
              <SelectContent>
                {contractors.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nombre ?? `Contratista #${c.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="flex items-center gap-2"
          disabled={saving || isInvalid()}
        >
          <Save className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default CreateContractor;
