import {
  registrarProducto,
  listarProductos,
  buscarProductoPorID,
} from "../services/productosService.js";

export async function postProductos(req, res, next) {
  try {
    const registrado = await registrarProducto(req.body);
    res.status(201).json(registrado);
  } catch (error) {
    req(error);
  }
}

export async function getProductos(req, res, next) {
  try {
    res.status(200).json(await listarProductos());
  } catch (error) {
    next(error);
  }
}

export async function getProductosPorID(req, res, next) {
  try {
    let IdProductoBuscado = await buscarProductoPorID(
      req.params.IdProducto.toString()
    );
    IdProductoBuscado != null
      ? res.status(200).json(IdProductoBuscado)
      : res.status(400).json({ error: "ID no encontrado" });
  } catch (error) {
    next(error);
  }
}
