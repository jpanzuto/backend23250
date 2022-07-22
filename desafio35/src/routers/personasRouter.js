import { Router } from "express";
import * as personasController from "../controllers/personasController.js";

const personasRouter = Router();

personasRouter.get("/", personasController.getPersonas);
personasRouter.get("/:IdPersona", personasController.getPersonasPorID);
personasRouter.get(
  "/username/:UsernamePersona",
  personasController.getPersonasPorUsername
);

export default personasRouter;
