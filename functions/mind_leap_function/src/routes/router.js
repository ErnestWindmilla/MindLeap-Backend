const express = require("express")
const router = express.Router()
const userPrincipalRouter = require('./userPrincipal')
//const cors = require('cors');
const UserTuteeRouter = require("./userTutee")
const TaskRouter = require("./tasks" )
const asignTaskRouter = require('./asingnTasks')
const assignMasterRouter = require('./assignMaster')
const TaskArchiveRouter = require('./taskArchive')
const fs = require('fs');
const { sessionInfo } = require('../middleware/sessionInfo' )
const { join } = require('path');
const catalyst = require('zcatalyst-sdk-node') 
const path = require('path')
const { blob } = require("stream/consumers")
const re = new RegExp(".*\.");
const FOLDERID = process.env.FOLDERID_USERPRINCIPAL
const mime = require('mime');
// const filestore = catalyst.filestore()

const UPLOAD_DIR = join( __dirname, '../files');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

//check the session
router.use( sessionInfo );

//get Files
router.use('/files/:id',(async (req, res) => {
  
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
    
} ));

//router.use('/admin',adminRouter)
router.use('/userPrincipal',userPrincipalRouter)
//router.use('',loginRouter)
router.use('/asignTask' ,asignTaskRouter )
router.use('/assignMaster' , assignMasterRouter )
router.use('/userTutee' , UserTuteeRouter)
router.use('/task' , TaskRouter )
router.use('/taskArchive' , TaskArchiveRouter )

module.exports = router