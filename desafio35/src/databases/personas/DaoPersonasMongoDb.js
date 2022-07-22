import DaoMongoDb from "../shared/mongodb/DaoMongoDb.js";

export default class DaoPersonasMongoDb extends DaoMongoDb {
  constructor(db) {
    super(db, "personas");
  }
}
