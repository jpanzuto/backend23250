import {
  listarPersonas,
  buscarPersonaPorUsuername,
  buscarPersonaPorId,
} from "../services/personasService.js";

export async function getPersonas(req, res, next) {
  try {
    res.status(200).json(await listarPersonas());
  } catch (error) {
    next(error);
  }
}

export async function getPersonasPorID(req, res, next) {
  try {
    let IdPersonaBuscada = await buscarPersonaPorId(
      req.params.IdPersona.toString()
    );
    IdPersonaBuscada != null
      ? res.status(200).json(IdPersonaBuscada)
      : res.status(400).json({ error: "ID no encontrado" });
  } catch (error) {
    next(error);
  }
}

export async function getPersonasPorUsername(req, res, next) {
  try {
    let UsernamePersonaBuscada = await buscarPersonaPorUsuername(
      req.params.UsernamePersona.toString()
    );
    UsernamePersonaBuscada != null
      ? res.status(200).json(UsernamePersonaBuscada)
      : res.status(400).json({ error: "Username no encontrado" });
  } catch (error) {
    next(error);
  }
}
