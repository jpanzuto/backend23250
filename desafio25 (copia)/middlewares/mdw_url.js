
//captura de error cuando se quiere ingresar a una ruta inexistente
const ruta_invalida =(req,res,next)=>{
  res.json({
    error:-2, 
    descripción:`La ruta '${req.url}' método '${ req.method}' no existe`
  });
}

module.exports = {ruta_invalida};