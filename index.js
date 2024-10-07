// const express = require('express');
// const catalyst = require('zcatalyst-sdk-node');
// const router = require('./src/routes/router'); // Importa el archivo de rutas
// //const middleware = require('./src/models/user')
// //const searchQuery  = require('./src/models/user')
// const app = express()

// app.use(router, (req, res) => {

// 	let cat = catalyst.initialize(req)
// 	let searchQuery = {
// 		"search" : "$usuarios",
// 		"search_table_columns" : {
// 			   "usuarios"  :["CREATORID"]
// 		   }
// 	   }
// 	//res.send('Ya debe funcionar algo si quiera')
	
	
// 	//datastore_service = cat.datastore()
	
	
// 	cat.search().executeSearchQuery(searchQuery).then(resp =>{
// 		//Your processing logic here
// 		res.send('<h1>Si jala</h1>')
// 		}).catch(err =>{
// 		//Your error logic here
// 		res.send('No jala la vaina')
// 		});

		

// 	//	let usuario = (req, res) => {
// 	// 	//	let cat = catalyst.initialize(req)
// 	// 		let data = cat.datastore()
			
// 	// 		let tabla = data.table('usuarios')
// 	// 		let columnPromise = tabla.getColumnDetails(26034000000008842);
// 	// 		columnPromise.then((column) => {console.log(column)})
			
// 	// //	}

// })

// //app.use(middleware)

// module.exports = app





const express = require('express');
const catalyst = require('zcatalyst-sdk-node'); 
const router = require('./src/routes/router')
//const searchQuery  = require('./src/models/user')
const cookieParser = require('cookie-parser')

const app = express()

// Middleware para procesar los json
 app.use( express.json())
 app.use( cookieParser() )

  app.use( router, (req, res) => {

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
		res.send('Si jala ahora tambien')
		}).catch(err =>{
		//Your error logic here
		res.send('No jala la vaina')
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