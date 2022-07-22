import DaoMySQL from "../shared/sql/DaoMySQL.js";

export default class DaoProductosMySQL extends DaoMySQL {
  constructor(knex) {
    super(knex, "productos");
  }
}
