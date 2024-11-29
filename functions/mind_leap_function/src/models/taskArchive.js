// const catalyst = require("zcatalyst-sdk-node");
const { Database } = require( "../middleware/conection")
// const { Filestore } = require("../middleware/filestore")
// const { userPrincipalModel } = require("../models/userPrincipal")
// const crypto = require('crypto')


const fs = require('fs');
const path = require('path');
const FOlDERID = process.env.FOLDERID_TASK

class TaskArchiveModel {

    static async getAll(req) {
        const app = await Database.connect(req);
        const connection = await app.zcql();
        return await connection.executeZCQLQuery(`SELECT * FROM taskArchive`).then(queryResult => {
            const valor = queryResult
            const mapeado = valor.map(item => item.taskArchive)
            return mapeado
        }).catch(err => {console.log('Error in select query', err)});
        
    }

    static async create(req, input){
        //Entrando al modelo
        console.log('Entrando al modelo')
        const {fileID, taskID} = req.body
        // console.log('req body',req.body)
        const app = await Database.connect(req);
        const connection = await app.zcql();
        const query = `INSERT INTO taskArchive (fileID, taskID) values ('${fileID}', '${taskID}');`;
        console.log(query)
        return await connection.executeZCQLQuery(query).then(queryResult => {
            if(queryResult){
                return connection.executeZCQLQuery(`Select * from taskArchive where ROWID = ${queryResult[0].taskArchive.ROWID};`).then(response => {
                    console.log(response)
                    return response[0].taskArchive
                }).catch(err => {console.log('Error on select query', err)})
            }else {return null}
        }).catch(err => {console.log('Error on insert query', err)});
    }
    

}

module.exports =  {TaskArchiveModel} ;