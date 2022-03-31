const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const PORT = 8080;

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const { engine } = require("express-handlebars");

const productosRouter = require('./routes/productos');

// Indicamos que queremos cargar los archivos estáticos que se encuentran en dicha carpeta
app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/productos', productosRouter);


//*******************************************************
// MOTOR DE PLANTILLA
app.engine(
    "hbs", // nombre del motor / plantilla  
    engine({ //engine viene del nombre como lo importe  const { engine } = require("express-handlebars");
      extname: ".hbs", // extension de los archivos, si no ponemos por defecto va ser .handlebars
      defaultLayout: "layout.hbs", //plantilla principal
      layoutsDir: __dirname + "/views/layouts", //ruta de la plantilla principal
      partialsDir: __dirname + "/views/partials", // ruta a las plantillas parciales
    })
  );
app.set("views", "./views");  //ubicacion de los archivos de plantilla
app.set("view engine", "hbs"); //motor de plantilla q vamos a utilizar "hbs"
//*******************************************************

// Esta ruta carga nuestro archivo index.html en la raíz de la misma
const cl_Producto = require("./modules/cl_Producto"); //importo la clase cl_Producto
const Producto = new cl_Producto();
let listaProductos = []
listaProductos = Producto.getProductos();
const date = new Date();
const listaMensajes = [{
  email:"Admin",
  fecha: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
  mensaje: "Bienvenido al chat!!"
}]

app.get('/', (req, res) => { 
  res.render("body", {listadoProducto: listaProductos,  listadoExiste: true});
})

//inicializamos el canal de websockets
io.on('connection', socket => {
    // "connection" se ejecuta la primera vez que se abre una nueva conexión
    console.log('Cliente nuevo conectado')
    //envio datos al cliente (desde servidor)
    socket.emit('msgTodosProductos', listaProductos ) // (evento, msg)
    socket.emit('msgTodosMensajesCHAT', listaMensajes ) // (evento, msg)

    socket.on('msgNuevoProducto', data => {  
      console.log("io.on sockek.on msgNuevoProducto: inicio (server.js): rtaPosData y listadoProductos")
      console.log(data);      
      if (data.status != "ok"){
        console.log("estado no OK: NO se agregó el producto")
      }else{
        console.log("estado OK: agregó el producto")
      } 
      console.log(listaProductos);
      io.sockets.emit('msgTodosProductos', listaProductos);
    })

    socket.on('nuevoMensajeCHAT', data => {
      console.log("io.on sockek.on nuevoMensajeCHAT: inicio (server.js):")
      console.log(data); 
      listaMensajes.push(data);
      console.log(listaMensajes);
      io.sockets.emit("msgTodosMensajesCHAT", listaMensajes);
    })
   
})

httpServer.listen(PORT, () =>{
  console.log(`Server con WebSocket IO ON en puerto ${httpServer.address().port}`);
})