const  {  validateUser , validatePartialUser } = require('../schemas/user')
const { userPrincipalModel } = require('../models/userPrincipal' )
const jwt =  require( 'jsonwebtoken' )
const catalyst = require('zcatalyst-sdk-node')
// Files 
const {upload , UPLOAD_DIR} = require('../middleware/upload'); 
const fs = require('fs');
const path = require('path');
// const { Filestore } = require("../middleware/filestore");
const { json } = require('express');
// const catalyst = require('zcatalyst-sdk-node')
const FOLDERID_USERPRINCIPAL = process.env.FOLDERID_USERPRINCIPAL

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
    static async  update  (req,res)  {

            // console.log('input a entrar',req.body)
        try{
            //Se sube el archivo por medio del metodo FileUpload al SERVIDOR no
            const fileData = await userPrincipalController.FileUpload(req, res)
            if(fileData === undefined){
                console.log('No se subio el archivo')

            }
            console.log('Si se subio el archivo',fileData)
            const result = validatePartialUser( req.body )
            const { id } = req.params
            console.log('SI ENTRA AL CONTROLADOR DE UPDATE',id)
            
            //Se checa si el archivo es valido
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        //Consigue el actual usuario
        const currentUser = await userPrincipalModel.getById(req, id);
        console.log('Current user', currentUser)
        //Verifica si el usuario existe
        if (!currentUser) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        //Se inicializa el sdk y se guarda la ID del NUEVO ARCHIVO en CATALYST
        let fileID
        const app = catalyst.initialize(req)

        if (fileData){
        
		const read = await fs.createReadStream(fileData.path)
        // console.log('read', read)
        // console.log('VALOR DE READ A VER SI SALE EL READSTREAM' ,read )
        fileID = await app.filestore().folder(FOLDERID_USERPRINCIPAL).uploadFile({//Guardar la id del archivo en
			code: read,
			name: fileData.filename
		}).catch(err => {
			console.log('Error uploading data', err)
        }).then((fileOject) => {
            console.log('fileObject',fileOject)
            return fileOject.id
        });
    }
        console.log('FILE ID',fileID)
        const userUpdate = {
            ...result.data,
            ...(fileID ? { profileImg: fileID } : {})   
        };
        console.log('Si llega hasta aca',req.body)
        const updateFinal = await userPrincipalModel.update(req, id , userUpdate)
        let eraseFile
            console.log('Se intenta borrar el archivo')
            //Se borra el archivo anterior 
            if(currentUser.profileImg && fileData)
            eraseFile = await app.filestore().folder(FOLDERID_USERPRINCIPAL).deleteFile(currentUser.profileImg).catch(err => {
                console.log('No existia imagen antes, o error al borrar imagen anterior', err)
            })
            if(eraseFile){ console.log('SE ha eliminado el archivo ')}
            if(fileData){
                console.log('Se intenta borrar el archivo local')
            await fs.unlink(fileData.path, (err) =>{
                if(err) console.log('Error al borrar el archivo local', err)
                    else {
                        console.log('Se ha borrado el archivo local')}
            })}
        res.status(201).json(updateFinal);
    }catch (error) {
        // if (fileData) {
        //                 console.log( "Borrando " , fileData.filename )
        //                 fs.unlink(path.join(UPLOAD_DIR, fileData.filename), (err) => {
        //                     if (err) console.error("Error al eliminar el archivo:", err);
        //                 });
        //             }
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