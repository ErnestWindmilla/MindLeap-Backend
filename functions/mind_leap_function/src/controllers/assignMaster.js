const { asignMasterModel } = require('../models/assignMaster' )
const { validateAssignMaster } = require('../schemas/assignMaster')

//const jwt =  require( 'jsonwebtoken' )

class asignMasterController {



    static async  getAll  (req,res)  {

        try {
            const assignMaster =  await asignMasterModel.getAll(req)
            res.json( assignMaster ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getAllbyUP  (req,res)  {
        const { idUP } = req.params
        try {
            const assignMaster =  await asignMasterModel.getAllbyUP( req, idUP)
            res.json( assignMaster ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getAllbyUT  (req,res)  {
        const { idUT } = req.params
        try {
            const assignMaster =  await asignMasterModel.getAllbyUT( idUT)
            res.json( assignMaster ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    // Create
    static async  create  (req,res)  {     
        
   
        const result = validateAssignMaster( req.body )
        
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            const assignMaster = await  asignMasterModel.create( result.data )
            res.status(201).json(assignMaster)
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        } 
    }

    // Delete
    static async  delete  (req,res)  {
        const { idUT , idUP} = req.params

        try {
            const AM = await asignMasterModel.delete( idUP , idUT )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
        res.status(200).send( true )
    }






}

module.exports = { asignMasterController };