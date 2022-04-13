const knex = require("knex");

class cl_Mensaje {
    #conexionDB; //para crear y cerrar conexiones en cada metodo
    constructor (datosConexion, table){
        this.datosConexion = datosConexion;
        this.tabla = table;
    }
  
    async crearTablaMensajes() {
        try {
            this.#conexionDB = knex(this.datosConexion);
            let conex = this.#conexionDB;
            let table = this.tabla
            await conex.schema.hasTable(table).then(async function (exists) {
                if (!exists) {
                    console.log("Crearemos la tabla MENSAJES que NO existe");
                    await conex.schema.createTable(table, function (campo) {
                        campo.increments("id").primary().notNullable();
                        campo.string("email");
                        campo.string("fecha");
                        campo.string("mensaje");
                    });
                } else {
                    console.log("La tabla MENSAJES ya existe")
                }
            });
        }
        catch (error) {
            console.error(`${error}`);
        }
        finally {
            this.#conexionDB.destroy();
        }
    }

    async getMensajes() {
        try {
            this.#conexionDB = knex(this.datosConexion);
            let rtaBD = await this.#conexionDB(this.tabla)
            return rtaBD;
        }
        catch (error) {
            console.error(`${error}`);
        }
        finally {
            this.#conexionDB.destroy();
        }
    };

    async insertMensaje(objMensaje) {
        try{
            this.#conexionDB=knex(this.datosConexion);
            let rtaBD = await this.#conexionDB(this.tabla).insert(objMensaje);
            console.log(`Mensaje agregado con id: ${rtaBD}`);
            return rtaBD;
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.#conexionDB.destroy();
        }
    }
}

module.exports = cl_Mensaje;