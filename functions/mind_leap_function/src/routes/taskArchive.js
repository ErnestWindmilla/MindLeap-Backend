const express = require("express");
const TaskArchiveRouter = express.Router();
const { TaskArchiveController } = require("../controllers/taskArchive");
const catalyst = require('zcatalyst-sdk-node') 
const  FOLDERID  = process.env.FOLDERID_TASK
// Validar los tipos de archivos que se pueden subir
// Subit archivos a catalyst
// Limitar la cantidad de archivos que se pueden subir por tarea
// Subir archivos a la base de datos
// Lectura, update, delete y descarga de archivos.
TaskArchiveRouter.get("/", TaskArchiveController.getAll);
TaskArchiveRouter.post("/", TaskArchiveController.create);
TaskArchiveRouter.use('/files/:id', (async (req, res) => {
  
    try {
    const app = catalyst.initialize(req)
    //Se obtiene los detalles del archivo para obtener el nombre del archivo para conseguir el tipo de archivo
    const fileDetails = await app.filestore().folder(FOLDERID).getFileDetails(req.params.id);
    
        const filefile = fileDetails.file_name

        //De donde viene el nomrbre del archivo, implementar el regex para crear la ruta correcta
        const patronNombre = /.*\./
        const patronTerminacion = /\..*/
        const nombre = patronNombre.exec(filefile)
        const terminacion = patronTerminacion.exec(filefile)
        const nombreFinal = req.params.id
        console.log('Nombre del archivo = ',nombre, '\n Tipo de archivo = ',terminacion)
    const fileBuffer = await app.filestore().folder(FOLDERID).downloadFile(req.params.id);
        res.status(200).setHeader('Connection', 'Keep-Alive').send(fileBuffer)//.sendFile(path.resolve(filePath))
} catch (error) {
        console.log('Error en obtener el archivo',error)
    }
    
} ))
// Primero el get

module.exports = TaskArchiveRouter;
//1. Debe regresar todas los archivos que tenga una tarea
//1.
//2. Subir archivos a catalyst