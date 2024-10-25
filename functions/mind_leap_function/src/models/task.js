const { query } = require("express");
const { Database } = require( "../middleware/conection")
const crypto = require('crypto')
class TaskModel {


  static async getAll(req) {
    const connection = await Database.connect(req);
    return await connection.executeZCQLQuery(`SELECT * FROM task;`).then(queryResult => {

      if(!(queryResult===0)) { 
        console.log('Entro al if')
        return queryResult
      }
        
      else { console.log('No entro al if')
        return null}
    })

    // if (!tasks) return null;

    // return tasks;
  }

  static async getById(req, id ) {
    const valor = id;
    const connection = await Database.connect(req);
    let query = `SELECT * FROM task WHERE idTask = ${id};`; ////CAMBIAR EL QUERY PARA EVItAR INYECCIONES SQL 
    return await connection.executeZCQLQuery(query).then(queryResult => {
      if(!(queryResult===0)) { 
        console.log('Entro al if')
        return queryResult
      }
        
      else { console.log('No entro al if')
        return null}
    });
    
    // const [task] = await connection.query(`SELECT * FROM task WHERE idTask = ?;`, [ id ]);

   

    // return task[0];
  }

  static async create( req, input ) {


    const {
      title,
      description,
      isPublic,
      video,
      image
    } = input;

    const connection = await Database.connect(req);
    // console.log(input)
    //Se genera el ID automaticamente y random con crypto
    // const [uuidResult] = await connection.query('SELECT UUID() as uuid;');
    let randomId;    
      if(req){
      randomId =crypto.randomUUID();
        }
    console.log(randomId)
    //const [{ uuid }] = uuidResult;


    try  {
      // let query = `INSERT INTO task (idTask, title,descripcion, isPublic, video, image) 
        // VALUES (?, ?, ?, ?, ?, ?);`,
        // [uuid, title, descripcion, isPublic, video, image];
        // [uuid, title, descripcion, isPublic, video, image] 
        
      const valor = await connection.executeZCQLQuery(
        `INSERT INTO task (idTask, title,description, isPublic, video, image) 
        VALUES ('`+randomId+`', '`+title+`', '`+description+`' ,`+isPublic+`, '`+video+`', '`+image+`');`
      );
      console.log(valor)
    }catch (e){
      throw new Error('Error creating task');
    }
  
  
    let query =`SELECT idTask, title, description, isPublic, video, image 
    FROM task WHERE idTask = '`+randomId+`';`
    const [task] = await connection.executeZCQLQuery(query).then(queryResult => {
      return queryResult
    });

    return task[0];
  }

  static async delete(req, id ) {
    const connection = await Database.connect(req);
    return  await connection.executeZCQLQuery(`DELETE FROM task WHERE idTask = '${id}'`).then(queryResult => {
      console.log('Resultado', queryResult)
      return queryResult
    }).catch(err => {
      console.log('Error in Delete Task', err)
      return null
    });
    
    
  }

  static async update(req, id, input) {
    const connection = await Database.connect(req);
    console.log(input)
    console.log( "Input :" + JSON.stringify(input) );
    // Extraer las claves y valores del input
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
    
    //console.log(setClause)

    try {
      const [result] = await connection.executeZCQLQuery(
        `UPDATE task SET ${updateFields} WHERE idTask = ${id};`
      );

      console.log( result );
  
      // if (result) {
      //   throw new Error('Task not found or no changes made');
      // }
  
      
      const [updatedTask] = await connection.executeZCQLQuery(
        `SELECT idTask, title, description, isPublic, video, image 
         FROM task WHERE idTask = ${id};`
      );
  
      return updatedTask[0];
    } catch (e) {
      console.log(e)
      //throw new Error('Error updating task');
    }
  }


  static async getAllbyCreator( id ) {
    const connection = await Database.connect();
    const [tasks] = await connection.query(`SELECT * FROM task WHERE idUP = ? ;` ,[id]);

    if (tasks.length === 0) return null;

    return tasks;
  }
  
}

module.exports = { TaskModel };
