const socket = io(); // Ya podemos empezar a usar los sockets desde el cliente

//*******************************************************
//FUNCIONES
//GETDATA --> devuelve un objeto con todos los productos 
async function getData (url) {
    console.log("INICIO getData")
    try{
        const rtaFech = await fetch(url);
        if (!rtaFech.ok){
            throw{error: rtaFech.status, statusText: rtaFech.statusText}
        }
        let rtaObjeto = await rtaFech.json();
        return rtaObjeto;
    }
    catch(error){
        console.error(error)
    }
  }

//POSDATA --> devuelve un objeto con el producto nuevo + id asignado.
async function postData (url,data) {
    console.log("INICIO postData, llamada x fetch a POST url");
    try{
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: { "Content-Type": "application/json; charset=utf-8"},
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    let respuesta = await response.json();
    console.log("postData: respuesta con id asignado al producto");
    console.log(respuesta);
    return respuesta.error != undefined ?  respuesta : {error: "error en funcion postData al querer agregar el nuevo producto"};
    }
    catch(error){
        console.error(error);
    }
  }

//agregarProducto --> boton agregar producto ---> obtiene datos del form, llama posdata y manda msg al Server.js y vacia form
async function agregarProducto(e){
    e.preventDefault(); 
    // obtengo los datos ingresados en el formulario
    let nuevoMensaje = {
        title: document.getElementById("nombre").value,
        price: document.getElementById("precio").value,
        thumbnail: document.getElementById("fotoUrl").value
    };
    console.log('Nuevo mensaje ',nuevoMensaje)
    //llamo a fx postData para que me genere id al nuevo producto
    let rtaAgregarProducto = await postData('api/productos', nuevoMensaje);
    rtaAgregarProducto != null ? socket.emit("msgNuevoProducto", {status: "ok"}) : socket.emit("msgNuevoProducto", {status: "no ok"});
    //borro los datos del formulario y lo vuelvo a dejar vacio
    document.getElementById("nombre").value="";
    document.getElementById("precio").value="";
    document.getElementById("fotoUrl").value="";
}

//agregarMensajeCHAT --> boton enviar nuevo mensaje de chat
function agregarMensajeCHAT(e){
    console.log("INICIO agregarMensajeCHAT");
    // cancela el evento de submit
    e.preventDefault(); 
    // obtengo los datos ingresados en el formulario
    let date = new Date();
    let nuevoMensajeCHAT = {
        email: document.querySelector("input[name=email]").value,
        fecha:  date.toLocaleDateString() + " " + date.toLocaleTimeString(),
        mensaje: document.querySelector("input[name=mensaje]").value
    };
    console.log("agregarMensajeCHAT: obtengo el nuevo mensaje de chat:");
    console.log(nuevoMensajeCHAT)
    //llamo a fx postData para que me genere id al nuevo producto
    console.log("agregarMensajeCHAT: envia mensaje al servidor");
    socket.emit("nuevoMensajeCHAT", nuevoMensajeCHAT);
    //borro solo el mensaje para que vuelva a enviar otro 
    document.querySelector("input[name=mensaje]").value="";
}

//RENDERLISTADOPRODUCTOS --> actualiza listado de productos
function renderListadoProductos(data){
    console.log("INICIO renderListadoProductos (index.js): actualizar listado productos en pantalla")
    console.log(data);
    let html
    if (data.length != 0 ) {
        html = `<table>
        <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Foto</th>
        </tr>`
        html = html + data.map(function(elem, index){
            return(`
            <tr>
            <td>${elem.title}</td>
            <td>${elem.price}</td>
            <td><img src="${elem.thumbnail}" width=150 height=80></td>
            </tr>
            `)
        }).join(" ");    
        html = html + `</table>`
    }else{
        html = "No hay ningun producto dado de alta."
    }

    document.getElementById("listadoProductos").innerHTML = html;
}

//RENDERLISTADOMENSAJES --> actualiza el chat
const renderListadoMensajes = data => {
    console.log("INICIO - renderListadoMensajes")
    console.log(data)
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

//*******************************************************
//Detecta cuando clickean el boton submit con id=altaProducto
window.addEventListener("DOMContentLoaded", async () => {    
    console.log("LOG addEventListener: inicio") 
    //detecta cuando clickea enviar en el alta de producto
    let altaProducto = document.getElementById("altaProducto");
    altaProducto.addEventListener("click", agregarProducto);   
    //detecta cuando clickea enviar para enviar un mensaje
    let nuevoMensajeCHAT = document.getElementById("nuevoMensajeCHAT");
    nuevoMensajeCHAT.addEventListener("click", agregarMensajeCHAT);    
})


//*******************************************************
// Cliente
socket.on('msgTodosProductos', data => {
    console.log("INICIO socket.on - msgTodosProductos (index.js)");
    console.log("listado productos: ");
    console.log(data);
    console.log("Actualizar datos del listado");
    renderListadoProductos(data);
})

socket.on('msgTodosMensajesCHAT', data => {
    console.log("INICIO socket.on - msgTodosMensajes (index.js)");
    console.log("listado mensajes: ");
    console.log(data);
    console.log("Actualizar datos del listado");
    renderListadoMensajes(data);
})