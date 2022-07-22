import { Router } from "express";
import * as webController from "../controllers/webController.js";
import userAuth from "../services/authService.js";
import compression from "compression";

const webRouter = Router();
webRouter.use(compression());

webRouter.get("/", userAuth, webController.homeGet);
webRouter.get("/info", userAuth, compression(), webController.infoGet);
webRouter.get("/productosaleatorios", webController.productosAleatoriosGet);
webRouter.get("/*", webController.url_invalida);

export default webRouter;
