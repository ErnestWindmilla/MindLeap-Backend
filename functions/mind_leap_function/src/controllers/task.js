const  {  validateTask , validatePartialTask } = require('../schemas/task')
const { TaskModel } = require('../models/task' )
const  multer = require( 'multer');
const {  extname, join }  = require('path');


const CURRENT_DIR = __dirname;
const UPLOAD_DIR =  join(CURRENT_DIR, '../files')
const MIMETYPES = ['image/jpeg', 'image/png'];

const multerUpload = multer({
    storage: multer.diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];

            cb(null, `${fileName}-${Date.now()}${fileExtension}`);
        },
    }),
    
    limits: {
        fieldSize: 10000000,
    },
});


class taskController {

    static async  getAll  (req,res)  {

        try {
            const tasks =  await TaskModel.getAll ()
            res.json( tasks ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getById  (req,res)  {
        const { id } = req.params
        
        try {
            const task = await TaskModel.getById( id )
    
            res.status(200).json( task )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    // Create
    static async  create  (req,res)  {
       
        const result = validateTask( req.body )
        
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            const newTask = await  TaskModel.create( result.data)
            res.status(201).json(newTask)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error )
        } 
    }

    // Delete
    static async  delete  (req,res)  {
        const { id } = req.params

        try {
            const task = await TaskModel.delete( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
        res.status(200).send( true )
    }

    // update
    static async  update  (req,res)  {
        const result = validatePartialTask( req.body )
        const { id } = req.params
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            console.log( result.data);
            const updatedTask = await  TaskModel.update(id , result.data )
            res.status(201).json(updatedTask)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error )
        } 
    }

    //get all by User Principal
    static async  getAllbyCreator  (req,res)  {

        try {
            const tasks =  await TaskModel.getAllbyCreator ()
            res.json( tasks ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }


    static async upload(req, res) {
        multerUpload.single('file')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // Error de Multer (p. ej., límite de archivo excedido)
                return res.status(400).json({ error: err.message });
            } else if (err) {
                // Otro tipo de error
                return res.status(400).json({ error: err.message });
            }
    
            // Si no hay errores y el archivo fue subido exitosamente
            if (!req.file) {
                return res.status(400).json({ error: 'No se ha subido ningún archivo' });
            }
    
            console.log(req.file); // Información del archivo subido
    
            const imageUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
            res.status(201).json({ message: 'Archivo subido correctamente', imageUrl });
        });
    }
    


    


   


}

module.exports = { taskController };