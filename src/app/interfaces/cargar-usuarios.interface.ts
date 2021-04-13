import { Usuario } from "../models/usuario.model";

export interface CargarUsuario {
  total: number;
  users: Usuario[];
}
