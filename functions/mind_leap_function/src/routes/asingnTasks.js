const express = require("express");
const assignTaskRouter = express.Router();
const { asignTaskController } = require("../controllers/asignTask");



// Routes


assignTaskRouter.get('/:idUT', asignTaskController.getAllbyUT )

assignTaskRouter.get('/:idUT/:idTask', asignTaskController.getById )

assignTaskRouter.post('/', asignTaskController.create )

assignTaskRouter.delete('/:idUT/:idTask', asignTaskController.delete )

assignTaskRouter.put('/:idUT/:idTask', asignTaskController.update )








module.exports = assignTaskRouter