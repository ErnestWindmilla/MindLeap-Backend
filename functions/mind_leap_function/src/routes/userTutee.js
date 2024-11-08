const express = require("express");
const UserTuteeRouter = express.Router();
const { userTuteeController } = require("../controllers/userTutee");



// Routes


UserTuteeRouter.get('/',  userTuteeController.getAll )

UserTuteeRouter.get('/:id', userTuteeController.getById )

UserTuteeRouter.get('/username/:username', userTuteeController.getByUsername )

UserTuteeRouter.post('/', userTuteeController.create )

UserTuteeRouter.delete('/:id', userTuteeController.delete )

UserTuteeRouter.put('/:id', userTuteeController.update )

// Login

UserTuteeRouter.post('/login',  userTuteeController.login )

UserTuteeRouter.post('/logout', userTuteeController.logout )








module.exports = UserTuteeRouter