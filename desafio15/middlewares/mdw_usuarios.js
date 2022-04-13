
const checkAccesAdmin = (req, res, next) => {
    if (req.user.type!= undefined && req.user.type === "admin") {
        next();
    }else{
      res.json({error:"No tiene permisos para realizar esta acción, debe tener permisos de Administrador."});
    }
  }

module.exports = {checkAccesAdmin};