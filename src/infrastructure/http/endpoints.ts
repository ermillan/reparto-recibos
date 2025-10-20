import { get } from "http";

export const ENDPOINTS = {
  // AUTH
  login: "/api/Auth/login",
  changePasswordFirstTime: "/api/Auth/cambiar-clave",
  forgotPassword: "/api/Auth/olvide-clave",
  verifyRecovery: "/api/Auth/verifica-recuperacion-clave",
  changePassword: "/api/Auth/cambiar-clave",
  getAuthOptions: "/api/Auth/opciones",

  // CONTRACTORS
  getContractors: "/api/Contratistas",

  // LISTS
  getListValues: "/api/Listas/valores",

  // PARAMETERS
  getSystemParameters: "/api/Parametros/sistema",
  updateSystemParameters: "/api/Parametros/sistema",

  // PROFILES
  createProfile: "/api/Perfil",
  updateProfile: "/api/Perfil",
  deleteProfile: "/api/Perfil",
  getProfileById: "/api/Perfil",
  profilesPaginated: "/api/Perfil/Paginado",
  getProfiles: "/api/Perfil",
  getAccessOptions: "/api/Perfil/OpcionAll",

  // USERS
  getUsersPaginated: "/api/Usuarios",
  createUser: "/api/Usuarios",
  updateUser: "/api/Usuarios",
  deleteUser: "/api/Usuarios",
  getUserById: "/api/Usuarios",
  getUsersAutocomplete: "/api/Usuarios/autocomplete",

  // RECEIPTS
  validateReceipts: "/api/CargaRecibos/validar",
  getReceiptsPaginated: "/api/CargaRecibos",
  confirmReceipts: "/api/CargaRecibos",
  deleteReceipts: "/api/CargaRecibos",

  //
  assignments: "/api/Assignment",
  assignmentFilters: "/api/Assignment/filters",
};
