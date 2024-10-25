const express = require("express");
const loginRouter = express.Router();
const { UserRepository } = require( '../models/prueba-user')
const { authController }= require( '../controllers/auth')
const { sessionInfo } = require('../middleware/sessionInfo' )

//check the session
loginRouter.use( sessionInfo );

// routes

loginRouter.post('/login',  authController.login )

loginRouter.post('/register', authController.register )

loginRouter.post('/logout', authController.logout )


// Test End Points //

// test the login
loginRouter.get('/protected',(req,res) => {
    //res.json({ "msg" : 'protected'})
    const { user } = req.session
   
    if (!user ) return res.status(403).json({ "msg" : "No auth" , "user" : req.session})
    res.json( user )
    
    
   
})

// test the registers
loginRouter.get('/all', async (req,res) => {
    //res.json({ "msg" : 'login'})
     const users =  await UserRepository.all ()
    
    if ( !users ) {
        res.status(500).send( "Server Fail" )
    }
        
    res.status(200).send( users )
 
    
 })

//Defining register

module.exports = loginRouter