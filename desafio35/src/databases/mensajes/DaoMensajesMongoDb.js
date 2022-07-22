import DaoMongoDb from '../shared/mongodb/DaoMongoDb.js'

export default class DaoMensajesMongoDb extends DaoMongoDb {
    constructor(db) {
        super(db, 'mensajes')
    }
}