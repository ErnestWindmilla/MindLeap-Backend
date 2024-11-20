require('dotenv').config();

const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const router = require('./src/routes/router'); 
//const searchQuery  = require('./src/models/user')
const cookieParser = require('cookie-parser')
const cors = require('cors');



const app = express()

const allowedOrigins = 'http://localhost:8080'
// Middleware para procesar los json
app.use( express.json())
app.use( cookieParser() )
app.use(cors({
	origin: 'http://localhost:8080', //'*',  // Cambia esto por el origen del frontend (dominio o puerto)
	credentials: true ,
	exposedHeaders: ['set-cookie'],               // Permitir credenciales (como cookies) en solicitudes cross-origin
	// Access-Control-Allow-Origin : 'http://localhost:8080'
  }));

// Ruta de prueba para verificar el acceso al archivo
// app.get('/test-file', cors(), (req, res) => {
//     const filePath = join(UPLOAD_DIR, 'NKW-1729720862886.jpg');
//     console.log(`Intentando servir el archivo: ${filePath}`);
//     res.sendFile(filePath, (err) => {
//         if (err) {
//             console.error("Error al enviar el archivo:", err);
//             res.status(404).send('Archivo no encontrado');
//         }
//     });
// });


 

app.use(router, (req, res) => {
	
	let cat = catalyst.initialize(req)
	let searchQuery = {
		"search" : "$usuarios",
		"search_table_columns" : {
			   "usuarios"  :["CREATORID"]
		   }
	   }
	//res.send('Ya debe funcionar algo si quiera')
	datastore_service = cat.datastore()
	cat.search().executeSearchQuery(searchQuery).then(resp =>{
		//Your processing logic here
		res.send('ya jala')
		}).catch(err =>{
		//Your error logic here
		res.send( 'aun Jala' )
		});

// let cat = catalyst.initialize(req);

//search query
// cat.search().executeSearchQuery(searchQuery).then(resp =>{
// //Your processing logic here
// resp.send('Si jala')
// }).catch(err =>{
// //Your error logic here
// resp.send('No jala la vaina')
// });

})

module.exports =app