import DaoMySQL from '../shared/sql/DaoMySQL.js'

export default class DaoPersonasMySQL extends DaoMySQL {
    constructor(knex) {
        super(knex, 'personas')
    }
}
