const  {  validateTask , validatePartialTask } = require('../schemas/task')
const { TaskModel } = require('../models/task' )

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
            const task = await TaskModel.getById(req, id )
    
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
            // console.log(result)
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            // console.log(result)
            const newTask = await  TaskModel.create(req,  result.data)
            // console.log(newTask)
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
            const task = await TaskModel.delete(req, id )
            console.log(task)
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
            const tasks =  await TaskModel.getAllbyCreator ()
            res.json( tasks ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }


    


   


}

module.exports = { taskController };