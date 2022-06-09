const cl_Producto = require("../modules/cl_Producto"); 
const dotenv = require('dotenv');
dotenv.config();
const host = process.env.HOST
const user = process.env.DB_USER
const password = process.env.PASSWORD
const database = process.env.DATABASE

const Producto = new cl_Producto (
    {
        client: "mysql",
        connection: {
            host,
            user,
            password,
            database,
            port: 3306,
        },
         pool: { min: 0, max: 7 },
    },
    "productos"
  );

module.exports = Producto ;