const {Database} = require('./conection')
const fs = require('fs')
const path = require('path')
const catalyst = require('zcatalyst-sdk-node')
// const {upload, UPLOAD_DIR} = require('./upload')


class Filestore {
    //                 catalyst, file, folderID  idTask/idUT/idUP
    static async upload(req, folderID, filename, upload_dir){
        console.log(req.file.data.name)
        const app = await catalyst.initialize(req);	
            
        await req.file.data.mv(`/tmp/${req.file.data.name}`);
        const response = app.filestore().folder(260340000000547056).uploadFile({
            code: fs.createReadStream(`/tmp/${req.file.data.name}`),
            name: req.file.data.name
        }).catch(err => {
            console.log('ERROR', err)
        });

        console.log(response)
        // try {
            
             
        //     // await app.filestore().folder(260340000000547056).uploadFile({
        //     //     code: fs.createReadStream(`/tmp/${req.file.data.name}`),
        //     //     name: req.file.data.name
        //     // }).catch(err => {
        //     //     console.log('ERROR', err)
        //     // });
    
        //     res.status(200).send({
        //         "status": "success",
        //         "message": "File Uploaded Successfully"
        //     })
        // } catch (error) {
        //     res.status(500).send({
        //         "status": "Internal Server Error",
        //         "message": error
        //     })
        // }
    }
    static async update(cat, filename, folderID, id){

    }
    static async delete(cat, filename, folderID, id){

    }
    static async get(cat, filename, folderID){

    }
}

module.exports = { Filestore }