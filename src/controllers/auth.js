
const  {  validateUser , validatePartialUser } = require('../schemas/user')
const { UserRepository } = require('../models/user')
const jwt =  require( 'jsonwebtoken' )
const SECRET_JWT_KEY = "1324567987DASDSAJHDGHJSAGDJHSAGDHJGASHDGHJSAGDHJGASKDJHKSDHJKAHDKSHDJASJDHJSDJHWYDUIYWC IVABDUOIWUDWFYUDFAUDVJHVCIWOKLOXJHC DHUDGHU$^%%(*&@)(#)(*!@d)sdda ddc +"// Importa el archivo de rutas

class authController {

    static async  register  (req,res)  {
        const { username , password } = req.body
        const result = validateUser( { username, password })
       
       if (!result.success) {
        // 422 Unprocessable Entity
          return res.status(422).json({ error: JSON.parse(result.error.message) })
        }
       
        try {
            const id =  await UserRepository.create (  { username , password })
            res.send ( {id} )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
    }


    static async  login  (req,res)  {
        const { username , password } = req.body
        console.log ( { username , password })
         
        try {
         const user =  await UserRepository.login (  { username , password })
         const token  = jwt.sign ( 
             { id: user.id ,username: user.username},
             SECRET_JWT_KEY ,
             { expiresIn :"1h" }
         )
         
         res.cookie('access_token' , token ,{
             httpOnly : true,
             //sameSite: 'strict' ,
             maxAge: 1000 * 60 * 60 // valida por una hora
     
         } ).send ( {user} )
         }catch (error){
         // Manejar el Error
         res.status(400).send( error.message )
         }  
    }

    static async  logout  (req,res)  {
        res.clearCookie('access_token').json({ "msg" : 'logout'})
     }

   


}

module.exports = { authController };