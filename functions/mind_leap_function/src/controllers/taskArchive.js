// const { TaskArchiveModel } = require('../models/taskArchive' )
const { TaskArchiveModel } = require('../models/taskArchive' )
// const { validateAsignTask , validatePartialAsignTask } = require ( '../schemas/asignTask' )
//const jwt =  require( 'jsonwebtoken' )
const catalyst = require('zcatalyst-sdk-node')
const {upload} = require('../middleware/upload')
const FOlDERID = process.env.FOLDERID_TASK
class TaskArchiveController {
    static async getAll(req, res){
        try {
            const tasks =  await TaskArchiveModel.getAll (req)
            res.json( tasks ).status( 200 )
        } catch (error) {
            // Manejar el Error
            res.status(400).send( error.message )
        }
        }

        static FileUpload(req, res) {
            return new Promise((resolve, reject) => {
              upload.single('file')(req, res, function (err) {
                if (err) {
                  return reject(err);
                }
                // console.log(req.file)
                resolve(req.file); // Resolver con los datos del archivo
              });
            });
          }

          //Create module 
        static async create(req, res){
            console.log('Entrando a archive create')
            const input = req.body
            console.log(req.body)

            console.log(input)
        try {
            const fileData = await TaskArchiveController.FileUpload(req, res)
            console.log('filedata desde el controlador' ,fileData)

            
            if(fileData == undefined){
                res.status(400).send('No se subio el archivo')
            }
            console.log('Si se subio el archivo',fileData)
            
            // let fileID =
            const app = catalyst.initialize(req)
            const config = {
                code: fstat.createReadStream(fileData.filenname),
                name: 'textFile.txt'
            }
            // let uploadPromise = 
            let archiveFilestore = await app.filestore().folder(FOlDERID).uploadFile(config);

            // const zcql = app.zcql();
            // await zcql.executeZCQLQuery(`INSERT INTO  (name, folderID) values ('${fileData.originalname}', '${FOlDERID}');`);

            const task =  await TaskArchiveModel.create (req, input)
            res.status(201).json(task)
        } catch (error) {
            // Manejar el Error
            res.status(400).send( error.message )
        }
    }
}

module.exports = { TaskArchiveController }