import Dao from '../Dao.js'

export default class DaoMemoria extends Dao {
    constructor() {
        super()
        this.objects = []
    }

    async guardar(object) {
        this.objects.push(object)
    }

    async listarTodas() {
        return this.objects
    }
}
