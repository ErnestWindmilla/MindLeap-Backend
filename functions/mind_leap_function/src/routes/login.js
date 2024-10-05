const express = require("express");
const loginRouter = express.Router();
const { UserRepository } = require( '../models/prueba-user')
const jwt =  require( 'jsonwebtoken' )
const { authController }= require( '../controllers/auth')
const SECRET_JWT_KEY = "1324567987DASDSAJHDGHJSAGDJHSAGDHJGASHDGHJSAGDHJGASKDJHKSDHJKAHDKSHDJASJDHJSDJHWYDUIYWC IVABDUOIWUDWFYUDFAUDVJHVCIWOKLOXJHC DHUDGHU$^%%(*&@)(#)(*!@d)sdda ddc +"// Importa el archivo de rutas

// const timeLog = (req, res, next) => {
//     console.log('Login')
//     next()
// }

// loginRouter.use(timeLog)

//Defining login page
loginRouter.use( (req , res , next) => {
    const token =  req.cookies.access_token
    req.session = { user: null }

    try {
        const data = jwt.verify( token , SECRET_JWT_KEY )
        req.session.user = data
    }catch {}

    next()
})

loginRouter.get('/all', async (req,res) => {
    //res.json({ "msg" : 'login'})
     const users =  await UserRepository.all ()
    
    if ( !users ) {
        res.status(500).send( "Server Fail" )
    }
        
    res.status(200).send( users )
 
    
 })
loginRouter.post('/login',  authController.login )

loginRouter.post('/register', authController.register )

loginRouter.post('/logout', authController.logout )

loginRouter.get('/protected',(req,res) => {
    //res.json({ "msg" : 'protected'})
    const { user } = req.session
   
    if (!user ) return res.status(403).json({ "msg" : "No auth" , "user" : req.session})
    res.json( user )
    
    
   
})

//Defining register

module.exports = loginRouter