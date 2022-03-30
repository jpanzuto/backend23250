const Contenedor = require("./Modulos/Contenedor.js");
const express = require("express");
const server = express();
const PORT = 8080;

const contenedorProductos = new Contenedor("./productos.txt");


function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

server.get("/",(req,res)=>
    {
        res.send("<h1 style='color: blue'>Desafio 6</h1>")
    })


server.get("/productos", (req,res) => {
    contenedorProductos.getAll()
      .then((listadoProductos) => res.send(listadoProductos))
      .catch( error => res.send(error.message))
  });
   
server.get("/productoRandom", (req,res) => {
    contenedorProductos.getAll()
    .then(async (listadoProductos) =>{
        let nroRandom = getRandomInt(1, listadoProductos.length);
        res.send(await contenedorProductos.getById(nroRandom));
    })
    .catch(error => res.send(error.message));
})


const connectedServer = server.listen(PORT, ()=>{
    console.log(`Servidor en puerto ${connectedServer.address().port}`);
})
connectedServer.on("error", error => console.log(`Error en servidor ${error}`));