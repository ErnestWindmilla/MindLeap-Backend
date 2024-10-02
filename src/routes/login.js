import { Router } from "express";
const loginRouter = Router();

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

export default loginRouter