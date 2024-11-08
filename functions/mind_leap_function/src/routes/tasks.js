const express = require('express');
const TaskRouter = express.Router();
const { taskController } = require('../controllers/task');
const { join } = require('path');
const fs = require('fs');

// Define the current directory of the script
const CURRENT_DIR = __dirname;

// Define the upload directory where files will be stored
const UPLOAD_DIR = join(CURRENT_DIR, '../files');

// Ensure the upload directory exists, if not, create it
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Serve static files (uploaded files) from the 'files' directory
// This makes uploaded files accessible through URLs like '/files/filename.ext'
TaskRouter.use('/files', express.static(UPLOAD_DIR));

// Routes for Task operations

// GET all tasks
TaskRouter.get('/', taskController.getAll);

// GET a task by its ID
TaskRouter.get('/:id', taskController.getById);

// GET task by Author
TaskRouter.get('/MadeBy/:idUP', taskController.madeBy);

TaskRouter.get('/byIsPublic/:isPublic' , taskController.getByIsPublic )
TaskRouter.get('/MadeByAndPublic/:idUP' , taskController.madeByAndPublic )



// POST (create) a new task
TaskRouter.post('/', taskController.create);

// DELETE a task by its ID
TaskRouter.delete('/:id', taskController.delete);

// PUT (update) a task by its ID
TaskRouter.put('/:id', taskController.update);

TaskRouter.post('/upload', taskController.upload );

module.exports = TaskRouter;
