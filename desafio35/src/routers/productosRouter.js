import { Router } from "express";
import * as productosController from "../controllers/productosController.js";

const productosRouter = Router();

productosRouter.post("/", productosController.postProductos);
productosRouter.get("/", productosController.getProductos);
productosRouter.get("/:IdProducto", productosController.getProductosPorID);

export default productosRouter;
