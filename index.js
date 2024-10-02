import express from 'express';
import routes from './src/routes/router.js';
import {corsMiddleware} from './src/middleware/cors.js';
//const corsMiddleware = require('./src/middleware/cors.js');



const app = express()
const PORT = process.env.PORT || 3001;  

app.use( corsMiddleware() )
// Ruteo
app.use('/',routes)



app.listen(PORT)
console.log("The backend is running in http://localhost:%d", PORT ) 
