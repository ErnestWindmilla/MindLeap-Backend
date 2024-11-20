const express = require("express");
const assignMasterRouter = express.Router();
const { assignMasterController } = require("../controllers/assignMaster");



// Routes


assignMasterRouter.get('/', assignMasterController.getAll )

assignMasterRouter.get('/:idUP', assignMasterController.getAllbyUP  )

assignMasterRouter.get('/masters/:idUT', assignMasterController.getAllbyUT )

assignMasterRouter.get('/tutees/:idUP', assignMasterController.getTutees)

assignMasterRouter.post('/', assignMasterController.create )

assignMasterRouter.delete('/:idUP/:idUT', assignMasterController.delete )










module.exports = assignMasterRouter