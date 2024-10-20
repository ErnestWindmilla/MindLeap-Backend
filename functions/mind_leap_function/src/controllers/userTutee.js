const  {  validateUserTutee , validatePartialUserTutee } = require('../schemas/userTutee')
const { userTuteeModel } = require('../models/userTutee' )
const jwt =  require( 'jsonwebtoken' )

class userTuteeController {


    static async  getAll  (req,res)  {

        try {
            const userTutee =  await userTuteeModel.getAll()
            res.json( userTutee ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getById  (req,res)  {
        const { id } = req.params
        
        try {
            const userTutee = await userTuteeModel.getById( id )
    
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
            const newUT = await  userTuteeModel.create( result.data)
            res.status(201).json(newUT)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error )
        } 
    }

    // Delete
    static async  delete  (req,res)  {
        const { id } = req.params

        try {
            const UT = await userTuteeModel.delete( id )
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
            const updatedUT = await  userTuteeModel.update(id , result.data )
            res.status(201).json(updatedUT)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error )
        } 
    }


    //login
    static async  login  (req,res)  {
        const { username , password } = req.body
        const { user } = req.session
       
        if ( user ) return res.status(400).json({ "msg" : "Already Login , logout" , "user" : req.session})

        try {
       
         const userTutee =  await userTuteeModel.login (  username , password )

         const token  = jwt.sign ( 
             { idUT: userTutee.idUP , username: userTutee.username},
                process.env.SECRET_JWT_KEY ,
             { expiresIn :"1h" }
         )
         
         res.cookie('access_token' , token ,{
             httpOnly : true,
             //sameSite: 'strict' ,
             maxAge: 1000 * 60 * 60 // valida por una hora
     
         } ).send ( {userTutee} )
         
        }catch (error){
         // Manejar el Error
         res.status(400).send( error.message )
         }  
    }

    static async  logout  (req,res)  {
        res.clearCookie('access_token').json({ "msg" : 'logout'})
     }
   
    
    // Task Realted
    static async  asignTask  (req,res)  {
        const { idUT , idTask , date } = req.body
       
        
        try {
            const asignTask = await  userTuteeModel.asignTask( idTask , idUT , date )
            res.status(201).json(asignTask)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        } 
        

        //res.status(200).json( { "msg" : "asignTask" ,   "params" : req.params , "Body" : req.body} )
    }

    static async  doneTask  (req,res)  {
        res.status(200).json( { "msg" : "Done Task" ,   "params" : req.params , "Body" : req.body} )
    }


    // asing Master
    static async  asignMaster  (req,res)  {
        res.status(200).json( { "msg" : "asignTask" ,   "params" : req.params , "Body" : req.body} )
    }


}

module.exports = { userTuteeController };