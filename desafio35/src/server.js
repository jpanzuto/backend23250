import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "./logger.js";
import config from "./config/config.js";

import apiRouter from "./routers/apiRouter.js";
import webRouter from "./routers/webRouter.js";
import manejadorDeErrores from "./middlewares/errores.js";
import { sessionHandler as session } from "./middlewares/session.js";
import {
  passportMiddleware,
  passportSessionHandler,
} from "./middlewares/passport.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "../src/public"));
app.set("view engine", "ejs");
//app.use(cookieParser("un secreto"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use(passportMiddleware);
app.use(passportSessionHandler);

app.use("/api", apiRouter);
app.use("/", webRouter);
app.use(manejadorDeErrores);

let server;

export async function conectar() {
  return new Promise((resolve, reject) => {
    server = app.listen(config.PORT, () => {
      logger.info(config);
      logger.info("Server iniciado en puerto", config.PORT);
      resolve();
    });
  });
}

export async function desconectar() {
  return new Promise((resolve) => {
    server.close(() => {
      logger.log("Se ha cerrado el servidor");
      resolve();
    });
  });
}
