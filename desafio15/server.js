const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const productosRouter = require('./routes/productos');
const mdw = require("./middlewares/mdw_url");

// Indicamos que queremos cargar los archivos estáticos que se encuentran en dicha carpeta
app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/productos', productosRouter);
app.use(mdw.ruta_invalida);


const cl_Producto = require("./modules/cl_Producto_DB"); 
const { isConstructorDeclaration } = require('typescript')

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

//creo la tabla productos
(async () => {
  try {
    await Producto.crearTablaProductos();
  } catch (err) {
    console.error(err);
  }
})();

let listadoProductos
(async () => {
  try {
    listadoProductos = await Producto.getProductos();
  } catch (err) {
    console.error(err);
  }
})();

const cl_Mensaje = require("./modules/cl_Mensaje");
const Mensaje = new cl_Mensaje(
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
  "mensajes"
);

//creo la tabla mensajes
(async () => {
  try {
    await Mensaje.crearTablaMensajes();
  } catch (err) {
    console.error(err);
  }
})();

//obtengo listado de Mensajes
const date = new Date();
let listaMensajes = [{ 
  email:"inicio@email.com",
  fecha: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
  mensaje: "Bienvenido al chat!!"
}];
(async () => {
  try {
    listaMensajes = await Mensaje.getMensajes();
  } catch (err) {
    console.error(err);
  }
})();






//abro conexion del lado del servidor
io.on("connection", (socket) => {  
  console.log('Usuario conectado')
  socket.emit('mensaje_inicio', listadoProductos) 
  socket.emit('msgTodosMensajesCHAT', listaMensajes ) 

  
  socket.on('mensaje_AltaProducto', data => {
    if (data.estado != "OK") {
      console.log("El producto no fue dado de alta.")
    } else {
      console.log("El producto fue dado de alta correctamente.")
      //mando mensaje a todos los conectados para actualizar su listado de productos.
      io.sockets.emit('mensaje_inicio', listadoProductos);
    }
  })

  //CHAT
  socket.on('nuevoMensajeCHAT', data => {
    listaMensajes.push(data);
    io.sockets.emit("msgTodosMensajesCHAT", listaMensajes);
    Mensaje.insertMensaje(data)
  })

});

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, () =>{
  console.log(`Server con WebSocket IO ON en puerto ${httpServer.address().port}`);
})