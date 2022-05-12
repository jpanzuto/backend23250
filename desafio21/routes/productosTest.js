const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");
faker.locale = 'es';

const getProductoAleatorio = id => ({
    nombre: faker.name.firstName(),
    precio: faker.finance.account(),
    foto: faker.image.image()
})

router.get('/', (req, res) => {
    const result = [];
    for (let i=0; i < 5; i++){
        result.push(getProductoAleatorio(i))
    }
    res.json(result);
})

module.exports = router;