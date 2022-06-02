const knex = require("knex");

class cl_Producto {
    
    #conexionDB; //para crear y cerrar conexiones en cada metodo
    constructor (datosConexion, table){
        this.datosConexion = datosConexion;
        this.tabla = table;
        }

    async crearTablaProductos(){       
       try {
            this.#conexionDB = knex(this.datosConexion);
            let conex = this.#conexionDB;
            let table = this.tabla

            await conex.schema.hasTable(table).then(async function(exists) {
                if (!exists) {
                    await conex.schema.createTable(table, function(campo) {
                            campo.increments("id").primary().notNullable();
                            campo.float("codigo");
                            campo.string("fechaHora");
                            campo.string("nombre");
                            campo.string("descripcion");
                            campo.integer("precio");
                            campo.string("imagenURL");
                            campo.integer("stock");
                        });
                } else {
                    console.log("La tabla PRODUCTOS ya existia")
                }
              });
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.#conexionDB.destroy();
        }
    }

    async getProductos() {
        try{
            this.#conexionDB=knex(this.datosConexion);
            let rtaBD = await this.#conexionDB(this.tabla)
            return rtaBD; 
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.#conexionDB.destroy();
        }
      };

    async getProductoById(idProducto){       
        try{
            this.#conexionDB=knex(this.datosConexion);
            let rtaBD = await this.#conexionDB(this.tabla).where("id",idProducto);
            return rtaBD;
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.#conexionDB.destroy();
        }
    }

    //recibe y agrega un producto, y lo devuelve con su id asignado
    async setProducto(objProductoIN){
        try{
            this.#conexionDB=knex(this.datosConexion);
            let rtaBD = await this.#conexionDB(this.tabla).insert(objProductoIN);
            console.log(`El producto fue agregado con id: ${rtaBD}`);
            return rtaBD;
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.#conexionDB.destroy();
        }
    }
    

    async updateProducto(idProducto,objProducto){
        try{
            this.#conexionDB=knex(this.datosConexion);
            return await this.#conexionDB(this.tabla).where("id",idProducto).update(objProducto);
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.#conexionDB.destroy();
        }
    }

    async deleteProducto(idProducto){
        try{
            this.#conexionDB=knex(this.datosConexion);
            return await this.#conexionDB(this.tabla).where("id",idProducto).del();
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.#conexionDB.destroy();
        }
    }
}

module.exports = cl_Producto;