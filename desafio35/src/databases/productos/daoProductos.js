import DaoProductosMemoria from "./DaoProductosMemoria.js";
import DaoProductosMongoDb from "./DaoProductosMongoDb.js";
import DaoProductosMySQL from "./DaoProductosMySQL.js";

import config from "../../config/config.js";

let daoProductos;
switch (config.MODO_PERSISTENCIA) {
  case "mongodb":
    const { db } = await import("../shared/mongodb/mongoClient.js");
    daoProductos = new DaoProductosMongoDb(db);
    break;
  case "mysql":
    const { knex } = await import("../shared/sql/knexClient.js");
    daoProductos = new DaoProductosMySQL(knex);
    break;
  default:
    daoProductos = new DaoProductosMemoria();
}

export default daoProductos;
