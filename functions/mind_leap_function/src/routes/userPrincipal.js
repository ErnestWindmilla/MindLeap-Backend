const express = require("express");
const userPrincipalRouter = express.Router();
const { userPrincipalController } = require("../controllers/userPrincipal");
const { sessionInfo } = require('../middleware/sessionInfo' )


// Routes


userPrincipalRouter.get('/',  userPrincipalController.getAll )

userPrincipalRouter.get('/:id', userPrincipalController.getById )

userPrincipalRouter.post('/', userPrincipalController.create )

userPrincipalRouter.delete('/:id', userPrincipalController.delete )

userPrincipalRouter.put('/:id', userPrincipalController.update )


// Login

userPrincipalRouter.post('/login',  userPrincipalController.login )

userPrincipalRouter.post('/logout', userPrincipalController.logout )




// test the login
userPrincipalRouter.get('/protected',(req,res) => {
    //res.json({ "msg" : 'protected'})
    const { user } = req.session
   
    if (!user ) return res.status(403).json({ "msg" : "No auth" , "user" : req.session})
    res.json( user )
    
    
   
})




module.exports = userPrincipalRouter