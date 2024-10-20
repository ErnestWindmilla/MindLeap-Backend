const { asignTaskModel } = require('../models/asignTask' )
const { validateAsignTask , validatePartialAsignTask } = require ( '../schemas/asignTask' )
//const jwt =  require( 'jsonwebtoken' )

class asignTaskController {


    static async  getAllbyUT  (req,res)  {
        const { idUT } = req.params
        try {
            const asignTask =  await asignTaskModel.getAllbyUT( idUT)
            res.json( asignTask ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getById  (req,res)  {
        const { idUT , idTask} = req.params
        
        try {
            const asignTask = await asignTaskModel.getById( idTask , idUT )
    
            res.status(200).json( asignTask )
            //const user = taskModel.getById( id )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
       
    }

    // Create
    static async  create  (req,res)  {     
        
        //const { idUT , idTask , date , state } = req.body
        const result = validateAsignTask( req.body )
        
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            const asignTask = await  asignTaskModel.create( result.data )
            res.status(201).json(asignTask)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        } 
    }

    // Delete
    static async  delete  (req,res)  {
        const { idUT , idTask} = req.params

        try {
            const UT = await asignTaskModel.delete( idTask , idUT )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
        res.status(200).send( true )
    }

    // update
    static async  update  (req,res)  {
        const result = validatePartialAsignTask( req.body )
        const { idUT , idTask} = req.params
        //const { date , state } = req.body
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            console.log( result.data);
            const updatedAT = await  asignTaskModel.update(  idTask , idUT , result.data)
            res.status(201).json(updatedAT)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message)
        } 
    }




}

module.exports = { asignTaskController };