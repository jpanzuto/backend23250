import DaoMongoDb from "../shared/mongodb/DaoMongoDb.js";

export default class DaoProductosMongoDb extends DaoMongoDb {
  constructor(db) {
    super(db, "productos");
  }
}
