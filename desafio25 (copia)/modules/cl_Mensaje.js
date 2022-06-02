const { MongoClient, ObjectId } = require ('mongodb');
const {normalize, denormalize, schema} = require('normalizr')

const mongo_url = 'mongodb://localhost:27017/mensajes'
const client = new MongoClient(mongo_url, { serverSelectionTimeOutMS: 5000 });
client.connect();
console.log('Conectado con Mensajes en Mongoose');

class cl_Mensajes {
    constructor (){
        this.collection = client.db("mensajes").collection("chat")
    }

    //Agregar mensajes a la base de datos
    async insertMensaje (objMensaje) {
        try{
            await this.collection.insertOne(objMensaje);            
            console.log("Mensaje agregado con exito en MONGO");
            return;
        }
        catch(error){
            console.error(`${error}`);
        }
    }

    async getMensajes() {
        try{
            return await this.collection.find().toArray()
        }
        catch(error){
            console.error(`${error}`);
        }
      }


    async normalizar () {
        try{
            const arrayMensajes =  await client.db("mensajes").collection("chat").find().toArray();
            const chatCompleto = {
                id: 1,
                mensajes: arrayMensajes              
            }
            console.log(chatCompleto)

            const mensajeSchema = new schema.Entity('mensajes')
            const chatSchema = new schema.Entity('chatCompleto',{
                mensajes:[mensajeSchema]
            })

            const normalizeObj = normalize(chatCompleto, chatSchema);

            // Muestra por pantalla el objeto original
            const util = require('util')
            function print(objeto) {
                console.log(util.inspect(objeto,false,12,true))
            }

            console.log("------ estructra del objeto normalizado -------")
            print(normalizeObj);

            console.log("-------- cant original --------")
            console.log(JSON.stringify(chatCompleto).length);

            console.log("----- cant normalizado --------")
            console.log(JSON.stringify(normalizeObj).length);

            console.log("------ cant desnormalizado ----")
            const denormalizeObj = denormalize(normalizeObj.result, chatSchema, normalizeObj.entities);
            console.log(JSON.stringify(denormalizeObj).length);

            console.log("--------- compresion ----------")
            console.log((JSON.stringify(normalizeObj).length*100)/JSON.stringify(chatCompleto).length);

            return normalizeObj
        }
        catch(error){
            console.error(`${error}`);
        }
    }
}

module.exports = cl_Mensajes;