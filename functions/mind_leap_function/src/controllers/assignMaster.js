const { assignMasterModel } = require('../models/assignMaster' )

const { validateAssignMaster } = require('../schemas/assignMaster')

//const jwt =  require( 'jsonwebtoken' )

class assignMasterController {



    static async  getAll  (req,res)  {

        try {
            const assignMaster =  await assignMasterModel.getAll(req)
            res.json( assignMaster ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    static async  getAllbyUP  (req,res)  {
        const { idUP } = req.params
        console.log('Calores', idUP)
        try {
            const assignMaster =  await assignMasterModel.getAllbyUP(req, idUP)
            res.json( assignMaster ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
    }

    static async  getAllbyUT  (req,res)  {
        const { idUT } = req.params
        try {
            const assignMaster =  await assignMasterModel.getAllbyUT(req, idUT)
            res.json( assignMaster ).status( 200 )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
    
        }
        
    }

    // Create
    static async  create  (req,res)  {     
        
        console.log('Entrando al create')
        const result = validateAssignMaster( req.body )
        
        if (!result.success) {
            // 422 Unprocessable Entity
              return res.status(422).json({ error: JSON.parse(result.error.message) })
        }       
        
        try {
            console.log('Esta empezando el try')
            const assignMaster = await  assignMasterModel.create(req, result.data )
            console.log(assignMaster)
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
            const AM = await assignMasterModel.delete( req, idUP , idUT )
        }catch (error){
            // Manejar el Error
            res.status(400).send( error.message )
        }  
       
        res.status(200).send( true )
    }

    static async getTutees (req, res) {
        const {idUP} = req.params

        try {
            const am = await assignMasterModel.getTutees(req, idUP)
            res.status(201).json(am)
        }catch(error){
            res.status(400).send(error.message)
        }
    }






}

module.exports = { assignMasterController };