const  {  validateUserTutee , validatePartialUserTutee } = require('../schemas/userTutee')
const { userPrincipalModel } = require('../models/userPrincipal' )
const jwt =  require( 'jsonwebtoken' )

class userPrincipalController {

    static async  getAll  (req,res)  {

        try {
            const userTutee =  await userPrincipalModel.getAll()
            res.json( userTutee ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getById  (req,res)  {
        const { id } = req.params
        
        try {
            const userTutee = await userPrincipalModel.getById( id )
    
            res.status(200).json( userTutee )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    // Create
    static async  create  (req,res)  {
       
        const result = validateUserTutee( req.body )
        
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            const newUP = await  userPrincipalModel.create( result.data)
            res.status(201).json(newUP)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error )
        } 
    }

    // Delete
    static async  delete  (req,res)  {
        const { id } = req.params

        try {
            const UP = await userPrincipalModel.delete( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
        res.status(200).send( true )
    }

    // update
    static async  update  (req,res)  {
        const result = validatePartialUserTutee( req.body )
        const { id } = req.params
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            console.log( result.data);
            const updatedUT = await  userPrincipalModel.update(id , result.data )
            res.status(201).json(updatedUT)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error )
        } 
    }


    static async  login  (req,res)  {
        const { username , password } = req.body
        const { user } = req.session
       
        if ( user ) return res.status(400).json({ "msg" : "Already Login , logout" , "user" : req.session})

        try {
       
         const userPrincipal =  await userPrincipalModel.login (  username , password )

         const token  = jwt.sign ( 
             { idUP: userPrincipal.idUP , username: userPrincipal.username},
                process.env.SECRET_JWT_KEY ,
             { expiresIn :"1h" }
         )
         
         res.cookie('access_token' , token ,{
             httpOnly : true,
             //sameSite: 'strict' ,
             maxAge: 1000 * 60 * 60 // valida por una hora
     
         } ).send ( {userPrincipal} )
         
        }catch (error){
         // Manejar el Error
         res.status(400).send( error.message )
         }  
    }

    static async  logout  (req,res)  {
        res.clearCookie('access_token').json({ "msg" : 'logout'})
     }



 

   
   


}

module.exports = { userPrincipalController };