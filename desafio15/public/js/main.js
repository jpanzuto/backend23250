const socket = io();

//agregarMensajeCHAT --> boton enviar nuevo mensaje de chat
function agregarMensajeCHAT(e){
  e.preventDefault(); 
  let date = new Date();
  let nuevoMensajeCHAT = {
      email: document.querySelector("input[name=email]").value,
      fecha:  date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      mensaje: document.querySelector("input[name=mensaje]").value
  };
  socket.emit("nuevoMensajeCHAT", nuevoMensajeCHAT);
  document.querySelector("input[name=mensaje]").value="";
}

//muestra listado de productos por pantalla
async function mostrarListadoProductos(data) {
    const fetchTemplateHbs = await fetch("/templates/listado_productos.hbs");
    const templateHbs = await fetchTemplateHbs.text();
    const template = Handlebars.compile(templateHbs);
    const html = template({ productos: data });
    document.querySelector("#listado_productos").innerHTML = html;
}

//RENDERLISTADOMENSAJES --> actualiza el chat
const renderListadoMensajes = data => {
  let html
  if (data.length != 0 ) { 
      html = data.map(function(elem, index){
          return (`<div>
          <span class="chatEmail">${elem.email}</span>
          <span class="chatFecha">[${elem.fecha}]: </span>
          <span class="chatMensaje">${elem.mensaje}</span>
          </div>`)
      }).join(" ");
  }
  document.querySelector("#listadoMensajes").innerHTML = html;
};

//abro conexion del lado del cliente con el mensaje enviado por servidor
socket.on('mensaje_inicio', data => {
    mostrarListadoProductos(data);
})

//CHAT
socket.on('msgTodosMensajesCHAT', data => {
  renderListadoMensajes(data);
})

//  SUBMIT --> FORMULARIO PRODUCTOS.
  document
  .querySelector("#formAltaProducto") 
  .addEventListener("submit", async (e) => {
    console.log("Evento submit alta producto");
    e.preventDefault(); 
    const date = new Date();
      let fechaHora = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    console.log(fechaHora)
    let nuevoProducto = {
        codigo: document.querySelector("#formAltaProducto input[name=codigoProducto]").value,
        fechaHora: fechaHora,
        nombre: document.querySelector("#formAltaProducto input[name=nombreProducto]").value,
        descripcion: document.querySelector("#formAltaProducto input[name=descripcionProducto]").value,
        precio: document.querySelector("#formAltaProducto input[name=precioProducto]").value,
        imagenURL: document.querySelector("#formAltaProducto input[name=imagenProducto]").value,
        stock: document.querySelector("#formAltaProducto input[name=stockProducto]").value,
    };
    console.log(nuevoProducto);
    let rtaAgregarProducto = await fetch("/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoProducto),
    });
    //respondo al servidor si se dio o no de alta el producto
    rtaAgregarProducto != null ? socket.emit("mensaje_AltaProducto", {estado: "OK"}) : socket.emit("mensaje_AltaProducto", {estado: "ERROR"});
    //borro los datos del formulario y lo vuelvo a dejar vacio
    document.querySelector("#formAltaProducto input[name=codigoProducto]").value="";
    document.querySelector("#formAltaProducto input[name=nombreProducto]").value="";
    document.querySelector("#formAltaProducto input[name=descripcionProducto]").value="";
    document.querySelector("#formAltaProducto input[name=precioProducto]").value="";
    document.querySelector("#formAltaProducto input[name=imagenProducto]").value="";
    document.querySelector("#formAltaProducto input[name=stockProducto]").value="";
  });


  //Detecta cuando clickean el boton submit con id=altaProducto
window.addEventListener("DOMContentLoaded", async () => {    
  //detecta cuando clickea enviar para enviar un mensaje
  let nuevoMensajeCHAT = document.getElementById("nuevoMensajeCHAT");
  nuevoMensajeCHAT.addEventListener("click", agregarMensajeCHAT);    
})