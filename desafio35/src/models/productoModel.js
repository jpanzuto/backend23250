function crearId() {
  return `${Date.now()}`;
}

export function crearProducto(datos) {
  if (!datos.nombre) throw new Error('falta el campo "nombre"');
  if (!datos.precio) throw new Error('falta el campo "precio"');
  if (!datos.stock) throw new Error('falta el campo "stock"');

  return {
    id: crearId(),
    nombre: datos.nombre,
    precio: datos.precio,
    stock: datos.stock,
  };
}
