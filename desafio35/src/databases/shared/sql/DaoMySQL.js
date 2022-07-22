import Dao from '../Dao.js'

export default class DaoMySQL extends Dao {
    constructor(knex, nombreTabla) {
        super()
        this.knex = knex
        this.nombreTabla = nombreTabla
    }

    async guardar(registro) {
        await this.knex(this.nombreTabla).insert(registro)
    }

    async listarTodas() {
        return this.knex(this.nombreTabla).select()
    }
}