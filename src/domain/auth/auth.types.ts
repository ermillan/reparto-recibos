export type Usuario = {
  id: number;
  login: string;
  nombre: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  usuario: Usuario;
};
