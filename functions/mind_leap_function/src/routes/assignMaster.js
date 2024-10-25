const express = require("express");
const assignMasterRouter = express.Router();
const { asignMasterController } = require("../controllers/assignMaster");



// Routes


assignMasterRouter.get('/', asignMasterController.getAll )

assignMasterRouter.get('/:idUP', asignMasterController.getAllbyUP  )

assignMasterRouter.get('/masters/:idUT', asignMasterController.getAllbyUT )

assignMasterRouter.post('/', asignMasterController.create )

assignMasterRouter.delete('/:idUP/:idUT', asignMasterController.delete )










module.exports = assignMasterRouter