const express = require("express")
const loginRouter = express.Router();

const timeLog = (req, res, next) => {
    console.log('Login')
    next()
}

loginRouter.use(timeLog)

//Defining login page
loginRouter.get('/',(req,res) => {
    res.send('Pantalla de login')
})

//Defining register

module.exports = loginRouter