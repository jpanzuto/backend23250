const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  local: {
    nombre: String,
    password: String
  }
});

// Genera un hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Chequea que la contraseña sea valida
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// Crear el modelo para el usuario y exponerlo a la app
module.exports = mongoose.model('User', userSchema);
