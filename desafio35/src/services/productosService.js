import { crearProducto } from "../models/productoModel.js";
import daoProductos from "../databases/productos/daoProductos.js";

export async function registrarProducto(datos) {
  const producto = crearProducto(datos);
  await daoProductos.guardar(producto);
  return producto;
}

export async function listarProductos() {
  return await daoProductos.productosListarTodas();
}

export async function buscarProductoPorID(IdPersona) {
  return await daoProductos.productosPorID(IdPersona);
}
