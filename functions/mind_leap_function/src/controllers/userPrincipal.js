const  {  validateUser , validatePartialUser } = require('../schemas/user')
const { userPrincipalModel } = require('../models/userPrincipal' )
const jwt =  require( 'jsonwebtoken' )

class userPrincipalController {

    static async  getAll  (req,res)  {

        try {
            const userTutee =  await userPrincipalModel.getAll(req)
            res.json( userTutee ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getById  (req,res)  {
        const { id } = req.params
        
        try {
            const userTutee = await userPrincipalModel.getById(req, id )
    
            res.status(200).json( userTutee )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    // Create
    static async  create  (req,res)  {
       
        const result = validateUser( req.body )
        console.log(result.data)
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            const newUP = await  userPrincipalModel.create(req,  result.data)
            console.log(newUP)
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
            const UP = await userPrincipalModel.delete( req, id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
        res.status(200).send( true )
    }

    // update
    static async  update  (req,res)  {
        const result = validatePartialUser( req.body )
        const { id } = req.params
        console.log('result desde controlador', req.body)
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            console.log( result.data);
            const updatedUT = await  userPrincipalModel.update(req, id , result.data )
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
            console.log('user', user)
            console.log('Username', username, '\npassowrd', password)
         const userPrincipal =  await userPrincipalModel.login (  req, username , password )

         const token  = jwt.sign ( 
             { idUP: userPrincipal.idUP , username: userPrincipal.username},
                process.env.SECRET_JWT_KEY ,
             { expiresIn :"1h" }
         )

         res.cookie('user', { 'idUP' : userPrincipal.idUP }  , {
            httpOnly: false, // Cambiado a false para pruebas
            secure: false,   // Cambiado a false si no usas HTTPS
            //sameSite: 'None',
            maxAge: 1000 * 60 * 60 // 1 hora
        })
        
        
        
         res.cookie('access_token' , token ,{
             httpOnly : false,
             secure: false,
             //sameSite: 'strict' ,
             maxAge: 1000 * 60 * 60 // valida por una hora
     
         } )
         console.log("Cookies actuales despues del login: ", req.cookies);
         res.send ( {userPrincipal} )
         
        }catch (error){
         // Manejar el Error
         res.status(400).send( error.message )
         }  
    }

    static async  logout  (req,res)  {
      
       // Debug: Mostrar las cookies actuales
        console.log("Cookies actuales: ", req.cookies);

        // Borrar la cookie 'user'
        res.clearCookie('user', {
            httpOnly: false,  // Igual que en la creación
            secure: false,    // Mismo valor que en la creación
            path: '/'         // Asegúrate de que coincida el path
        });

        // Borrar la cookie 'access_token'
        res.clearCookie('access_token', {
            httpOnly: false,   // Mismo valor que en la creación
            secure: false,    // Igual que en la creación
            path: '/'         // El path debe coincidir
        });

        // Respuesta al cliente confirmando que se eliminaron las cookies
        res.status(200).json({ message: 'Sesión cerrada y cookies eliminadas' });
        
     }



 

   
   


}

module.exports = { userPrincipalController };