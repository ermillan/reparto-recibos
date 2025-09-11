// src/presentation/router/routes.ts
export const ROUTES = {
  PUBLIC: {
    LOGIN: "/login",
    CHANGE_PASSWORD: "/cambiar-contrasena",
  },
  PRIVATE: {
    DASHBOARD: "/dashboard",
    SECURITY: {
      PROFILES: "/seguridad/perfiles",
      CREATE_PROFILE: "/seguridad/perfiles/crear-perfil",
      UPDATE_PROFILE: "/seguridad/perfiles/actualizar-perfil/:id",
      USERS: "/seguridad/usuarios",
      CREATE_USER: "/seguridad/usuarios/crear-usuario",
      UPDATE_USER: "/seguridad/usuarios/actualizar-usuario/:id",
    },
    ADMINISTRATION: {
      UPDATE_PARAMS: "/administracion/actualizar-parametros",
    },
    RECEIPTS: {
      ROOT: "/recibos",
      UPLOAD: "/recibos",
      LEGACY_UPLOAD: "/recibos",
    },
  },
  FALLBACK: "*",
} as const;
