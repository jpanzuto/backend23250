//captura de error cuando se quiere ingresar a una ruta inexistente
const { logger } = require("../logger");

const ruta_invalida = (req, res, next) => {
  logger.warn(`La ruta '${req.url}' método '${req.method}' no existe`);
  res.json({
    error: -2,
    descripción: `La ruta '${req.url}' método '${req.method}' no existe`,
  });
};

module.exports = { ruta_invalida };
