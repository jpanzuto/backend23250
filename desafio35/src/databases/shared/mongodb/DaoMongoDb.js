import Dao from "../Dao.js";

export default class DaoMongoDb extends Dao {
  constructor(db, nombre) {
    super(db, nombre);
  }

  async guardar(document) {
    await this.collection.insertOne(document);
  }

  async personasListarTodas() {
    return this.collection.find().project({ _id: 0 }).toArray();
  }
  async personasPorID(ID) {
    return this.collection.findOne({ id: ID });
  }
  async personasPorUsername(USERNAME) {
    return this.collection.findOne({ username: USERNAME.toLowerCase() });
  }

  async productosListarTodas() {
    return this.collection.find().project({ _id: 0 }).toArray();
  }
  async productosPorID(ID) {
    return this.collection.findOne({ id: ID });
  }
  async autenticarLogueo(username, password) {
    let usuario;
    try {
      usuario = await this.collection.findOne({
        username: username.toLowerCase(),
      });
    } catch (error) {
      throw new Error("error de autenticacion 1");
    }
    if (usuario.password !== password) {
      throw new Error("error de autenticacion 2");
    }
    return usuario;
  }
}
