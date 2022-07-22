import { buscarPersonaPorUsuername } from "../services/personasService.js";

function crearId() {
  return `${Date.now()}`;
}

export async function crearPersona(datos) {
  if (await buscarPersonaPorUsuername(datos.username.toLowerCase()))
    throw new Error("Error en el usuario");
  if (!datos.username) throw new Error("falta el campo usuario");
  if (!datos.password) throw new Error("falta el campo contraseña");

  return {
    id: crearId(),
    username: datos.username.toLowerCase(),
    password: datos.password,
  };
}
