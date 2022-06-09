function numerosAleatorios(cantidad) {

    const mapNumeroCantidad = new Map();
    
    for (let i = 0; i < cantidad; i++) {
        const numeroAleatorio = Math.floor(Math.random() * 1000) +1;
        const cantidadTotalDelNumeroAleatorio = mapNumeroCantidad.get(numeroAleatorio) ?? 0;
        mapNumeroCantidad.set(numeroAleatorio, cantidadTotalDelNumeroAleatorio+1);
    }
    
    return Array.from(mapNumeroCantidad).sort((x,y)=>x[0]-y[0]).map(elemento=>{return {numero:elemento[0],cantidad:elemento[1]}});

}

//  PRINCIPAL
process.on("message", cantidad => {
    const resultado = numerosAleatorios(cantidad);
    process.send(resultado);
    process.exit();
})