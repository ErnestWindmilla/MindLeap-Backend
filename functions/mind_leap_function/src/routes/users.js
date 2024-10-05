const express = require("express")
const userRouter = express.Router();

//Middleware specific to this router

const timeLog = (req, res, next) => {
    console.log('User')
    next()
}

userRouter.use(timeLog)

//Defining home page
userRouter.get('/', (req, res) => {
    //res.send('Pantalla de inicio de usuario normal')
})
//Defining about in the oage
userRouter.get('/settings', (req, res) => {
   // res.send('Pantalla de configuracion de usuario')
})

module.exports = userRouter
