const express = require("express");
const TaskRouter = express.Router();
const { taskController } = require("../controllers/task");



// Routes


TaskRouter.get('/',  taskController.getAll )

TaskRouter.get('/:id', taskController.getById )

TaskRouter.post('/', taskController.create )

TaskRouter.delete('/:id', taskController.delete )

TaskRouter.put('/:id', taskController.update )






module.exports = TaskRouter