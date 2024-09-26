const express = require('express')
const routes = require('./src/routes/router.js')

const app = express()
const PORT = process.env.PORT || 3001;

// Login
app.use('/',routes)

app.listen(PORT)
console.log("The backend is runninf in http://localhost:%d", PORT )
