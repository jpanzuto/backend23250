const express = require("express");
const router = express.Router();

//GET '/info' -> devuelve info del process
router.get("/",(req,res)=>{

    const objeto = {
        argumentos_entrada:process.argv.slice(2),
        plataforma:process.platform,  
        version_node:process.version,
        memoria_total_reservada:process.memoryUsage().rss,
        path_ejecucion:process.execPath,
        process_id:process.pid,
        carpeta_proyecto:process.cwd(), 
    }

    res.status(200).json(objeto);
});

module.exports = router;