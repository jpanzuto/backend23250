import { Router, json } from "express";
import personasRouter from "./personasRouter.js";
import productosRouter from "./productosRouter.js";
import authRouter from "./authRouter.js";
import userAuth from "../services/authService.js";

const apiRouter = Router();

apiRouter.use(json());

apiRouter.use("/personas", personasRouter);
apiRouter.use("/productos", productosRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
