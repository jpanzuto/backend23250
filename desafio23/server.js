const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const MongoStore = require('connect-mongo')
const session = require("express-session") 

const productosRouter = require('./routers/productos');
const productosTestRouter = require('./routers/productosTest');
const authRouter = require('./routers/auth')
const mdw = require("./middlewares/mdw_url");
const cl_Mensaje = require('./modules/cl_Mensaje');
const Mensaje = new cl_Mensaje();

app.use(session({
  store: MongoStore.create({ 
    mongoUrl: 'mongodb+srv://coderhouse_user:coderhouse_password@mymaincluster.eucl2.mongodb.net/coderhouse?retryWrites=true&w=majority' 
  }),

  secret: 'secreto',
  resave: true,
  saveUninitialized: true,
  cookie: {
        maxAge: 60000
        }
  }))


// Indicamos cargar los archivos estáticos
app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/productos', productosRouter);
app.use('/api/productos-test', productosTestRouter);
app.use('/login', authRouter);
app.use(mdw.ruta_invalida);



//creo la tabla productos
const Producto = require("./modules/db");
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


//obtengo listado de Mensajes
let listaMensajes =  [ Mensaje.getMensajes()]


//abro conexion del lado del servidor
io.on("connection", (socket) => {  
  console.log('Usuario conectado')
  socket.emit('mensaje_inicio', listadoProductos) 
  socket.emit('msgTodosMensajesCHAT', listaMensajes ) 

  socket.on('mensaje_AltaProducto', data => {
    if (data.estado != "OK") {
      console.log("El producto no fue dado de alta")
    } else {
      console.log("El producto fue dado de alta")
      //mensaje para actualizar los productos de todos los conectados
      io.sockets.emit('mensaje_inicio', listadoProductos);
    }
  })

  //CHAT
  socket.on('nuevoMensajeCHAT', data => {
    listaMensajes.push(data);
    Mensaje.insertMensaje(data);
    Mensaje.normalizar();
    console.log(listaMensajes);
    io.sockets.emit("msgTodosMensajesCHAT", listaMensajes);
  })

});

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, () =>{
  console.log(`Server ON en puerto ${httpServer.address().port}`);
})