const { MongoClient, ObjectId } = require("mongodb");
const { normalize, denormalize, schema } = require("normalizr");
const { logger } = require("../logger");

const mongo_url = "mongodb://localhost:27017/mensajes";
const client = new MongoClient(mongo_url, { serverSelectionTimeOutMS: 5000 });
client.connect();
logger.info(`Conectado con Mensajes en Mongoose`);

class cl_Mensajes {
  constructor() {
    this.collection = client.db("mensajes").collection("chat");
  }

  //Agregar mensajes a la base de datos
  async insertMensaje(objMensaje) {
    try {
      await this.collection.insertOne(objMensaje);
      logger.info(`Mensaje agregado con exito en MONGO`);
      return;
    } catch (error) {
      logger.error(`${error}`);
    }
  }

  async getMensajes() {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      logger.error(`${error}`);
    }
  }

  async normalizar() {
    try {
      const arrayMensajes = await client
        .db("mensajes")
        .collection("chat")
        .find()
        .toArray();
      const chatCompleto = {
        id: 1,
        mensajes: arrayMensajes,
      };
      logger.info(chatCompleto);

      const mensajeSchema = new schema.Entity("mensajes");
      const chatSchema = new schema.Entity("chatCompleto", {
        mensajes: [mensajeSchema],
      });

      const normalizeObj = normalize(chatCompleto, chatSchema);

      // Muestra por pantalla el objeto original
      const util = require("util");
      function print(objeto) {
        logger.info(util.inspect(objeto, false, 12, true));
      }

      logger.info("------ estructra del objeto normalizado -------");
      print(normalizeObj);

      logger.info("-------- cant original --------");
      logger.info(JSON.stringify(chatCompleto).length);

      logger.info("----- cant normalizado --------");
      logger.info(JSON.stringify(normalizeObj).length);

      logger.info("------ cant desnormalizado ----");
      const denormalizeObj = denormalize(
        normalizeObj.result,
        chatSchema,
        normalizeObj.entities
      );
      console.log(JSON.stringify(denormalizeObj).length);

      logger.info("--------- compresion ----------");
      logger.info(
        (JSON.stringify(normalizeObj).length * 100) /
          JSON.stringify(chatCompleto).length
      );

      return normalizeObj;
    } catch (error) {
      logger.error(`${error}`);
    }
  }
}

module.exports = cl_Mensajes;
