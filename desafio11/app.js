var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const PORT = 8080;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const productosRouter = require("./routes/productos");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/productos", productosRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const MENSAJES = [
  {
    email: "Admin",
    fyh: "11/03/22 10:00",
    message: "Bienvenido al chat!",
  },
];

app.io = io;

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado", socket.id);
  // agregar el nuevo mensaje enviado
  socket.on("new_message", (data) => {
    MENSAJES.push(data);
    io.sockets.emit("messages_received", MENSAJES); // Este emit es para cada nuevo mensaje
  });
  io.sockets.emit("messages_received", MENSAJES);//Este emit es para el primer momento de conexion
});


app.get('/', (req, res) => { 
  res.render("body");
})

// error handler
app.use(function (err, req, res, next) {
  io;
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

httpServer.listen(PORT, () =>{
  console.log(`Server con WebSocket IO ON en puerto ${httpServer.address().port}`);
})