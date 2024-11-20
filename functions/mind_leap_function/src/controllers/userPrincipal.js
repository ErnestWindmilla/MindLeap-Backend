const  {  validateUser , validatePartialUser } = require('../schemas/user')
const { userPrincipalModel } = require('../models/userPrincipal' )
const jwt =  require( 'jsonwebtoken' )
const catalyst = require('zcatalyst-sdk-node')
// Files 
const {upload , UPLOAD_DIR} = require('../middleware/upload'); 
const fs = require('fs');
const path = require('path');
const { Filestore } = require("../middleware/filestore");
const { json } = require('express');
// const catalyst = require('zcatalyst-sdk-node')


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
        
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            const newUP = await  userPrincipalModel.create( req, result.data)
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

    static FileUpload(req, res) {
        return new Promise((resolve, reject) => {
          upload.single('file')(req, res, function (err) {
            if (err) {
              return reject(err);
            }
            // console.log(req.file)
            resolve(req.file); // Resolver con los datos del archivo
          });
        });
      }
    // update
    static async  update  (req,res)  {
        try{
        const fileData = await userPrincipalController.FileUpload(req, res);
        console.log('FILE', fileData)
        const result = validatePartialUser( req.body )
        console.log(fileData)
        
        const { id } = req.params
        const currentUser = await userPrincipalModel.getById(req, id);
        const app = catalyst.initialize(req)
		const read = await fs.createReadStream(fileData.path)

        await app.filestore().folder('26034000000054705').uploadFile({//Guardar la id del archivo en
			code: read,
			name: fileData.filename
		}).catch(err => {
			console.log('Error uploading data', err)
		});

        res.status(201).json(currentUser);
    }catch (error) {
        if (fileData) {
                        console.log( "Borrando " , fileData.filename )
                        fs.unlink(path.join(UPLOAD_DIR, fileData.filename), (err) => {
                            if (err) console.error("Error al eliminar el archivo:", err);
                        });
                    }
                    res.status(400).json({ error: error.message });
    }
            
    }


    static async  login  (req,res)  {
        const { username , password } = req.body
        const { user } = req.session
      
        if ( user ) return res.status(400).json({ "msg" : "Already Login , logout" , "user" : req.session})

        try {
       
         const userPrincipal =  await userPrincipalModel.login (req, username , password )

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