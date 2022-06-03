const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const { url } = require('./config/database.js');

mongoose.connect(url, {
	useMongoClient: true
});
console.log('BD Usuarios conectada')

require('./config/passport')(passport);

app.set('views', path.join(__dirname, './public'));
app.set('view engine', 'ejs');

const productosRouter = require('./routers/productos');
const productosTestRouter = require('./routers/productosTest');
const mdw = require("./middlewares/mdw_url");
const cl_Mensaje = require('./modules/cl_Mensaje');
const Mensaje = new cl_Mensaje();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: 'frasesecreta',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routers/auth')(app, passport);


// Indicamos cargar los archivos estáticos
app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/productos', productosRouter);
app.use('/api/productos-test', productosTestRouter);
app.use(mdw.ruta_invalida);

//creo la tabla productos
const Producto = require("./config/db");
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