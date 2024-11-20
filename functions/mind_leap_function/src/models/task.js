const { connect } = require("http2");
const { Database } = require( "../middleware/conection")
const { Filestore } = require("../middleware/filestore")
const { userPrincipalModel } = require("../models/userPrincipal")
const crypto = require('crypto')
const fs = require('fs');
const path = require('path');
class TaskModel {
  static async getAll(req) {

    const app = await Database.connect(req);
    const connection = await app.zcql()
    return await connection.executeZCQLQuery(`SELECT * FROM task;`).then(queryResult => {

      if(!(queryResult===0)) { 
        const valor = queryResult
        const mapeado = valor.map(item => item.task)
        return mapeado
      }
        
      else { console.log('No entro al if')
        return null}
    })
  }

  static async getById( req, id ) {
    
    // const valor = await userPrincipalModel.getROWIDuserPrincipal(req, id)
    const app = await Database.connect(req);
    const connection = await app.zcql()
    let query = `SELECT * FROM task WHERE idTask = ${id};`; ////CAMBIAR EL QUERY PARA EVItAR INYECCIONES SQL 
    return await connection.executeZCQLQuery(query).then(queryResult => {
      if(!(queryResult===0)) { 
        const valor = queryResult
        const mapeado = valor.map(item => item.task)
        
        return mapeado
      }
        
      else { 
        return null}
    });
  }

  static async madeBy( req, idUP ) {

    let id = await userPrincipalModel.getROWIDuserPrincipal(req, idUP)
    const app = await Database.connect(req);
    const connection = await app.zcql()
    console.log(id)
     return await connection.executeZCQLQuery(`SELECT * FROM task WHERE idUP like ${id}`).then(response => {

      const variable = response
      console.log(response.data)
      const transformation = variable.map(({ task }) => ({ ...task }));
      return transformation
    }).catch(err => { console.log('Error', err)})

  }

  static async madeByAndPublic(req, idUP ) {
    const valor = await userPrincipalModel.getROWIDuserPrincipal(req, idUP)
    const app = await Database.connect(req);
    const connection = await app.zcql()
    return await connection.executeZCQLQuery(`SELECT * FROM task WHERE idUP = ${valor} OR isPublic = true;`).then(response => {
      const variable = response
     // console.log('Response de modelo de MadeByandPULIC', variable)
      const transformation = variable.map(({ task }) => ({ ...task }));
      //console.log('Transformation in the model madeByAndPublic', transformation)
      return transformation;
    });
  }

  static async getByIsPublic(req, isPublic ) {
   console.log("ENtra a modelo de getByisPublic")
   let valor;
    if(isPublic == '1') valor = 'true' 
      else valor = 'false'
      const app = await Database.connect(req);
      const connection = await app.zcql()
    console.log('VALOR DE VALOR', valor)
    return await connection.executeZCQLQuery(`SELECT * FROM task WHERE isPublic = ${valor};`).then(response =>{
      const variable = response
     // console.log('Variable dentro de getByisPUBLIC', response)
      const transformation = variable.map(({ task }) => ({ ...task }));
      return transformation 
    }).catch(err => {console.log('Error en connection a la base de datos de BYPUBLIC', err)});
   
    
  }

  static async create(req,  input ) {
    
    console.log( " Modelo ")

    const {
      title,
      descripcion,
      isPublic,
      video,
      archivo, 
      idUP
    } = input;




    const app = await Database.connect(req);
    const file = await Filestore.upload(req, app,26034000000054641)
    // const connection = await app.zcql()


    
  //   try {
  //     const folderId = '26034000000054641';

  //     const fileName = path.basename(join(__dirname, 'pfp_test.jpg'));
  //     const fileStream = fs.createReadStream('/home/windmilla/Documents/GitHub/MindLeap-Backend/MindLeap-Backend/functions/mind_leap_function/src/files/pfp_test.jpg');

  //     const fileDetails = await file.folder(folderId).uploadFile({
  //         code: fileStream,
  //         name: fileName,
  //         type: 'image/jpeg'
  //     });

  //     console.log('Archivo subido exitosamente:', fileDetails);
      
  //     // Accede a los detalles
  //     const fileId = fileDetails.file_id; // ID del archivo
  //     const fileUrl = fileDetails.url;    // URL si es público

  //     console.log(`ID del archivo: ${fileId}`);
  //     console.log(`URL del archivo: ${fileUrl}`);
  // } catch (error) {
  //     console.error('Error al subir el archivo:', error);
  // }



    let id = await userPrincipalModel.getROWIDuserPrincipal(req, idUP )
    // console.log('ID_TESTING_TASK', id)
    let randomId;    
      if(req){
      randomId =crypto.randomUUID();
        }
    console.log(randomId)
    

    // try  {
    //     let query =  `INSERT INTO task (idTask, title,descripcion, isPublic, video, image, idUP) 
    //     VALUES ('`+randomId+`', '`+title+`', '`+descripcion+`' ,`+isPublic+`, '`+video+`', '`+archivo+`', ` +id+` );`
    //     console.log('query', query)
    //   const valor = await connection.executeZCQLQuery(query).then(response => { return response }).catch(err => { console.log('Error', err)});
    //   // console.log('task creation', valor)
    // }catch (e){
    //   throw new Error('Error creating task');
    // }
  
  
    // let query =`SELECT idTask, title, descripcion, isPublic, video, image 
    // FROM task WHERE idTask = '`+randomId+`';`
    // return  await connection.executeZCQLQuery(query).then(queryResult => {
    //   const value = queryResult
    //   const mapeado = value.map(item => item.task)
    //   return mapeado
    // }).catch(err => {
    //   console.log('ERROR', err)
    // });

    return task[0];
  }

  static async delete( req,id ) {
    // const valor = await TaskModel.getROWIDTask(req, id);
    const app = await Database.connect(req);
    const connection = await app.zcql()
    return  await connection.executeZCQLQuery(`DELETE FROM task WHERE idTask = '${id}'`).then(queryResult => {
      if(queryResult[0].task.DELETED_ROWS_COUNT===0) return null
      console.log('Resultado', queryResult[0].task.DELETED_ROWS_COUNT)
      return queryResult
    }).catch(err => {
      console.log('Error in Delete Task', err)
      return null
    });
  }

  static async update(req, id, input) {
    const valor = await TaskModel.getROWIDTask(req, id);
    const app = await Database.connect(req);
    const connection = await app.zcql()
    console.log(input)
    console.log( "Input :" + JSON.stringify(input) );
    console.log('Enter the model')
    const keys = Object.keys(input);
    const values = Object.values(input);
  

    // Verificar si hay campos para actualizar
    if (keys.length === 0) {
      throw new Error('No fields to update');
    }
  
    // Construir la consulta dinámicamente
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const updateFields = Object.keys(input)
    .map(key => `${key} = '${input[key]}'`)
    .join(', ');
    

    
    try {
      const query =  `UPDATE task SET ${updateFields} WHERE idTask = '${id}';`
      console.log('query',query)
      const result = await connection.executeZCQLQuery(
        query
      ).then(response => { console.log('RESPONSE DE UPDATE', response) 
        return response
      }).catch(err => {console.log('ERROR EN MODELO DE UPDATE', err) });

      console.log( result );
  
      return  await connection.executeZCQLQuery(
        `SELECT idTask, title, descripcion, isPublic, video, image 
         FROM task WHERE idTask = '${id}';`
      ).then( response => {
        console.log('Info after update', response)
        return response
      });
  
      return updatedTask[0];
    } catch (e) {
      console.log(e)
      //throw new Error('Error updating task');
    }
  }

  static async getROWIDTask(req, idTask){
    const app = await Database.connect(req);
    const connection = await app.zcql()
    return await connection.executeZCQLQuery(`select ROWID from task where idTask like '${idTask}' `).then( response => {
      console.log('IDTASK de GETROWIDTASK', response)

      return response
    }).catch(err=> {
      console.log('Error in getROWIDTask', err)
    })
  }  
}

module.exports = { TaskModel };