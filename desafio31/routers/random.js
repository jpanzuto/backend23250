const express = require("express");
const router = express.Router();
const path = require('path');
const {fork} = require ('child_process')


router.get("/:cantidad",(req,res)=>{

    let cant = req.params.cantidad ?? 100000000;
    const proceso = fork("./numeros.js");

    proceso.on("message", data=>{
        res.status(200).json(data);
    });

    proceso.send(cant);
});

module.exports = router;