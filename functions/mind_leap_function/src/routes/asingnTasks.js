const express = require("express");
const asignTaskRouter = express.Router();
const { asignTaskController } = require("../controllers/asignTask");



// Routes


asignTaskRouter.get('/:idUT', asignTaskController.getAllbyUT )

asignTaskRouter.get('/:idUT/:idTask', asignTaskController.getById )

asignTaskRouter.post('/', asignTaskController.create )

asignTaskRouter.delete('/:idUT/:idTask', asignTaskController.delete )

asignTaskRouter.put('/:idUT/:idTask', asignTaskController.update )








module.exports = asignTaskRouter