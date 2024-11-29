const  {  validateUserTutee , validatePartialUserTutee } = require('../schemas/userTutee')
const { userTuteeModel } = require('../models/userTutee' )
const jwt =  require( 'jsonwebtoken' )
const catalyst = require('zcatalyst-sdk-node')


// Files 
const {upload , UPLOAD_DIR} = require('../middleware/upload'); 
const fs = require('fs');
const path = require('path');
const FOLDERID = process.env.FOLDERID_USERPRINCIPAL

class userTuteeController {

    //Get all tutees
    static async  getAll  (req,res)  {

        try {
            const userTutee =  await userTuteeModel.getAll(req)
            res.json( userTutee ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    //Get user image
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

    //Get user image?
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

    // Create missing
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

    // Delete Missing file
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

    //Local file upload
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

        // console.log('input a entrar',req.body)
    try{
        //Se sube el archivo por medio del metodo FileUpload al SERVIDOR no\
        console.log('Entra al modelo de update')
        const fileData = await userTuteeController.FileUpload(req, res)
        console.log('Se intenta subir el archivo', fileData)
        if(fileData === undefined){
            console.log('No se subio el archivo')

        }
        const result = validatePartialUserTutee( req.body )
        const { id } = req.params
        console.log('SI ENTRA AL CONTROLADOR DE UPDATE',id)
        
        //Se checa si el archivo es valido
    if (!result.success) {
        // 422 Unprocessable Entity
          return res.status(422).json({ error: JSON.parse(result.error.message) })
    }       
    
    //Consigue el actual usuario
    const currentUser = await userTuteeModel.getById(req, id);
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
    fileID = await app.filestore().folder(FOLDERID).uploadFile({//Guardar la id del archivo en
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
    const updateFinal = await userTuteeModel.update(req, id , userUpdate)
    let eraseFile
        console.log('Se intenta borrar el archivo')
        //Se borra el archivo anterior 
        if(currentUser.profileImg && fileData)
        eraseFile = await app.filestore().folder(FOLDERID).deleteFile(currentUser.profileImg).catch(err => {
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
                // Manejar el Error
                res.status(400).json({ error: error.message });
}
        
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