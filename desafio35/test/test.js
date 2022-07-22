import axios from 'axios'
import { conectar, desconectar } from '../src/server.js'

await conectar()

const serverUrl = 'http://localhost:8080/api/personas'

await axios.post(serverUrl, {
    nombre: 'marian',
    edad: 36
})

const { data: personas } = await axios.get(serverUrl)

console.log(personas)

await desconectar()