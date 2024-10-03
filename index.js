const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const router = require('./src/routes/router'); // Importa el archivo de rutas

const app = express()
app.use(router, (req, res) => {
	let cat = catalyst.initialize(req)
	res.send('Ya debe funcionar algo si quiera')
})

module.exports =app