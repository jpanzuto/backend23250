const cl_Producto = require("../modules/cl_Producto"); 
const Producto = new cl_Producto (
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

module.exports = Producto ;