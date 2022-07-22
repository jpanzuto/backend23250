export default class Dao {
  constructor(db, nombre) {
    this.collection = db.collection(nombre);
  }

  async guardar(obj) {
    throw new Error("falta implementar!");
  }

  async listarTodas() {
    throw new Error("falta implementar!");
  }

  async listarPorId(id) {
    throw new Error("falta implementar!");
  }
}
