const  {  validateUserTutee , validatePartialUserTutee } = require('../schemas/userTutee')
const { userTuteeModel } = require('../models/userTutee' )
const jwt =  require( 'jsonwebtoken' )


// Files 
const {upload , UPLOAD_DIR} = require('../middleware/upload'); 
const fs = require('fs');
const path = require('path');


class userTuteeController {


    static async  getAll  (req,res)  {

        try {
            const userTutee =  await userTuteeModel.getAll(req)
            res.json( userTutee ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getById  (req,res)  {
        const { id } = req.params
        
        try {
            const userTutee = await userTuteeModel.getById( req, id )
    
            res.status(200).json( userTutee )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    static async  getByUsername  (req,res)  {
        const { username } = req.params
        
        try {
            const userTutee = await userTuteeModel.getByUsername(req,  username )
    
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
            const newUT = await  userTuteeModel.create( req, result.data)
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
            const UT = await userTuteeModel.delete( req, id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
        res.status(200).send( true )
    }

    // update
    static async  update  (req,res)  {
        console.log('update Controller tutee')
        upload.single('file')(req, res, async function (err) {
            console.log('update Function')
            
            if (err) {
                return res.status(400).json({ error: 'Error al subir el archivo.' });
            }
            
            const result = validatePartialUserTutee( req.body )
            const { id } = req.params


            if (!result.success) {
                // 422 Unprocessable Entity
                  return res.status(422).json({ error: JSON.parse(result.error.message) })
            }       
            

            try {

                const currentUser = await  userTuteeModel.getById(req, id);
                if (!currentUser) {
                    return res.status(404).json({ error: 'Usuario no encontrado.' });
                }


                // Verifica si se subió un archivo
                const fileName = req.file ? req.file.filename : null;

                // Agrega el nombre del archivo al objeto de datos si existe
                const userUpdate = {
                    ...result.data,
                    ...(fileName ? { profileImg: fileName } : {})
                };

                const updatedUT = await  userTuteeModel.update(req, id , userUpdate )

                if (currentUser.profileImg && req.file) {
                    const previousImagePath = path.join(UPLOAD_DIR, currentUser.profileImg);
                    fs.unlink(previousImagePath, (err) => {
                        if (err) console.error("Error al eliminar la imagen anterior:", err);
                    });
                }


                res.status(201).json(updatedUT)
            } catch (error) {
                
                if (req.file) {
                    fs.unlink(path.join(UPLOAD_DIR, req.file.filename), (err) => {
                        if (err) console.error("Error al eliminar el archivo:", err);
                    });
                }
                res.status(400).json({ error: error.message });
            }
        });


    }

    //login
    static async  login  (req,res)  {
        const { username , password } = req.body
        const { user } = req.session
       
        if ( user ) return res.status(400).json({ "msg" : "Already Login , logout" , "user" : req.session})

        try {
       
         const userTutee =  await userTuteeModel.login (req,  username , password )

         const token  = jwt.sign ( 
             { idUT: userTutee.idUP , username: userTutee.username},
                process.env.SECRET_JWT_KEY ,
             { expiresIn :"1h" }
         )

         res.cookie('user', { 'idUT' : userTutee.idUT }  , {
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

         res.send ( {userTutee} )
         
      
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
            const asignTask = await  userTuteeModel.asignTask(req, idTask , idUT , date )
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