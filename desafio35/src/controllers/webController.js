import os from "os";
const cantidadDeCPUs = os.cpus().length;
import { faker } from "@faker-js/faker";
import logger from "../logger.js";

export async function homeGet(req, res, next) {
  try {
    res.status(200).send("GET Home");
  } catch (error) {
    next(error);
  }
}

export function url_invalida(req, res) {
  const title = "Ruta Invalida";
  const { url, method } = req;
  logger.warn(`Route ${method} ${url} no existe`);
  res.status(404).json({ titulo: title });
}

export async function infoGet(req, res, next) {
  try {
    const objeto = {
      argumentos_entrada: process.argv.slice(2),
      plataforma: process.platform,
      version_node: process.version,
      memoria_total_reservada: process.memoryUsage().rss,
      path_ejecucion: process.execPath,
      process_id: process.pid,
      carpeta_proyecto: process.cwd(),
      cantidad_cpus: cantidadDeCPUs,
    };
    res.status(200).json(objeto);
  } catch (error) {
    next(error);
  }
}

export async function productosAleatoriosGet(req, res, next) {
  faker.locale = "es";
  const getProductoAleatorio = (id) => ({
    nombre: faker.name.firstName(),
    precio: faker.finance.account(),
    foto: faker.image.image(),
  });
  try {
    const result = [];
    for (let i = 0; i < 5; i++) {
      result.push(getProductoAleatorio(i));
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
