var catalyst = require('zcatalyst-sdk-node');
const express = require('express');
const expressApp = express();
const routes = require('./src/routes/router')
module.exports= () => {
	expressApp.use('/test', routes);
	expressApp.listen(4000)
	// expressApp.get('/server/mind_leap_function/,(req,res)', () =>
	// 	{
	// 	  var app = catalyst.initialize(req); 
	// 	//This app variable is used to access the catalyst components.
	// 	//You can refer the SDK docs for code samples.
	// 	//Your business logic comes here
	// 	res.send('Bienvenido a Avanzado I/O')
	// 	});
};