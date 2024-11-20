// Model
const { TaskModel } = require('../models/task' )

// Validation
const  {  validateTask , validatePartialTask } = require('../schemas/task')


// Files 
const {upload , UPLOAD_DIR} = require('../middleware/upload'); 
const fs = require('fs');
const path = require('path');



class taskController {

    static async  getAll  (req,res)  {

        try {
            const tasks =  await TaskModel.getAll (req)
            res.json( tasks ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getById  (req,res)  {
        const { id } = req.params
        
        try {
            const task = await TaskModel.getById( req, id )
    
            res.status(200).json( task )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    static async  madeBy  (req,res)  {
        const { idUP } = req.params

        if( !idUP)  res.status(400).send( " idUP require " )

        try {
            const tasks = await TaskModel.madeBy( req, idUP )
    
            res.status(200).json( tasks )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    static async  getByIsPublic  (req,res)  {
        const { isPublic } = req.params

        if( !isPublic)  res.status(400).send( " idUP require " )

        try {
            console.log('isPublic', isPublic)
            const tasks = await TaskModel.getByIsPublic( req, isPublic )
    
            res.status(200).json( tasks )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    static async  madeByAndPublic  (req,res)  {
        const { idUP } = req.params

        if( !idUP)  res.status(400).send( " idUP require " )

        try {
            const tasks = await TaskModel.madeByAndPublic( req, idUP )
    
            res.status(200).json( tasks )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }
    // Create
    static async  create  (req,res)  {
       
        upload.single('file')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: 'Error al subir el archivo.' });
            }
            
            if (typeof req.body.isPublic == 'string'  ){
                const str = req.body.isPublic
                req.body.isPublic =  str.toLowerCase() === 'true'
            }
            const result = validateTask(req.body);

            if (!result.success) {
                return res.status(422).json({ error: JSON.parse(result.error.message) });
            }

            try {
                // Verifica si se subió un archivo
                const fileName = req.file ? req.file.filename : null;

                // Agrega el nombre del archivo al objeto de datos si existe
                const taskData = {
                    ...result.data,
                    ...(fileName ? { archivo: fileName } : {})
                };

               
                const newTask = await TaskModel.create(req, taskData);
                res.status(201).json(newTask);
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

    // Delete
    static async  delete  (req,res)  {
        const { id } = req.params

        try {
            const task = await TaskModel.delete( req, id )
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
        console.log('SI ENTRA AL CONTROLADOR DE UPDATE',id)
        console.log('SUCCESS', result)
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        console.log('BEFORE TRY')
        try {
            console.log( result.data);
            const updatedTask = await  TaskModel.update(req, id , result.data )
            res.status(201).json(updatedTask)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error )
        } 
    }

    //get all by User Principal
    static async  getAllbyCreator  (req,res)  {

        try {
            const tasks =  await TaskModel.getAllbyCreator (req)
            res.json( tasks ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }


    static async upload(req, res) {
        upload.single('file')(req, res, function (err) {
            if (err) {
                console.log(err.message)
                return res.status(400).json({ error: 'Error al subir el archivo.' });
            }
    
            const imageUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
            res.status(201).json({ message: 'Archivo subido correctamente', imageUrl });
        });
    }
    


    


   


}

module.exports = { taskController };