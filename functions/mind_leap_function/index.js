'use strict';

module.exports = (req, res) => {
	var url = req.url;

<<<<<<< Updated upstream


const app = express()

// Middleware para procesar los json
app.use( express.json())
app.use( cookieParser() )
app.use(cors({
	origin: 'http://localhost:8080',  // Cambia esto por el origen del frontend (dominio o puerto)
	credentials: true                // Permitir credenciales (como cookies) en solicitudes cross-origin
  }));
 

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
=======
	switch (url) {
		case '/':
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write('<h1>Hello from index.js<h1>');
			break;
		default:
			res.writeHead(404);
			res.write('You might find the page you are looking for at "/" path');
			break;
	}
	res.end();
};
>>>>>>> Stashed changes
