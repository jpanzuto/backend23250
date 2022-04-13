const express = require("express");
const { sendFile } = require("express/lib/response");
const router = express.Router();

const cl_Producto = require("../modules/cl_Producto_DB"); 
const Producto = new cl_Producto(
  {
      client: "mysql",
      connection: {
          host: "127.0.0.1",
          user: "root",
          password: "",
          database: "bdproductos",
          port: 3306,
      },
       pool: { min: 0, max: 7 },
  },
  "productos"
);

router.get("/", async (req, res)=>{    
    res.status(200).json(await Producto.getProductos());   
});


//GET '/api/productos/:id' -> devuelve un producto según su id.
router.get("/:idProducto",async (req, res)=>{
    let idProducto = parseInt(req.params.idProducto);
    if ( !isNaN(idProducto) ){        
        let rtaClase = await Producto.getProductoById(idProducto);
        rtaClase != null ? res.status(200).json(rtaClase): res.status(400).json({error:'El producto no fue encontrado'});
    }else{
        res.status(404).json({error:'El id ingresado no es numerico'});
    }    
});

//POST '/api/productos' -> agrega un producto, y lo devuelve con su id
router.post("", async (req,res)=>{
    let objProductoBody = {...req.body};
    let objProductoNuevo =  await Producto.setProducto(objProductoBody) 
    if(objProductoNuevo!=null){
        res.status(200).json(objProductoNuevo)
    }else{
        res.status(404).json({error:'Error al dar de alta el/los producto/s'});
    }   

 });

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
router.put("/:idProducto",async (req,res)=>{
    let idProducto = parseInt(req.params.idProducto);
    let objProductoBody = {...req.body};
    let rtaClase = await Producto.updateProducto(idProducto,objProductoBody)
    if(rtaClase){
        res.status(200).json({status:`OK`,message:`El producto con Id ${idProducto} fue actualizado correctamente.`});
    }else{
        res.status(406).json({error:`No se encontró el producto con id: ${idProducto}`});
    }
});

//DELETE '/api/productos/:id' -> elimina un producto según su id.
router.delete("/:idProducto", async(req,res)=>{
    let idProducto = parseInt(req.params.idProducto);
    let rtaClase = Producto.deleteProducto(idProducto);
    if(rtaClase){
        res.status(200).json({status:`OK`,message:`El producto con Id ${idProducto} no existia o fue eliminado correctamente`});
    }else{
        res.status(406).json({error:`Error al querer borrar el producto`});
    }
});

module.exports = router;