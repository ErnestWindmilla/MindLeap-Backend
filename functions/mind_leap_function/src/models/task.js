const { connect } = require("http2");
const { Database } = require( "../middleware/conection")
const { userPrincipalModel } = require("../models/userPrincipal")
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
  }

  static async getById( req, id ) {
    
    // const valor = await userPrincipalModel.getROWIDuserPrincipal(req, id)
    
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
  }

  static async madeBy( req, idUP ) {

    let id = await userPrincipalModel.getROWIDuserPrincipal(req, idUP)
    const connection = await Database.connect(req);
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
    // console.log('PRUEBA de madeBYAndPublic', valor)

    const connection = await Database.connect(req);
    const [tasks] = await connection.executeZCQLQuery(`SELECT * FROM task WHERE idUP = ${valor} OR isPublic = true;`);
    console.log('Task', tasks)
    return tasks;
  }


  static async getByIsPublic(req, isPublic ) {
   
    const connection = await Database.connect(req);
    const [tasks] = await connection.executeZCQLQuery(`SELECT * FROM task WHERE  isPublic = ${isPublic};`);

    return tasks;
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


    const connection = await Database.connect(req);

    let id = await userPrincipalModel.getROWIDuserPrincipal(req, idUP )
    // console.log('ID_TESTING_TASK', id)
    let randomId;    
      if(req){
      randomId =crypto.randomUUID();
        }
    console.log(randomId)


    try  {
        let query =  `INSERT INTO task (idTask, title,descripcion, isPublic, video, image, idUP) 
        VALUES ('`+randomId+`', '`+title+`', '`+descripcion+`' ,`+isPublic+`, '`+video+`', '`+archivo+`', ` +id+` );`
        console.log('query', query)
      const valor = await connection.executeZCQLQuery(query);
      // console.log('task creation', valor)
    }catch (e){
      throw new Error('Error creating task');
    }
  
  
    let query =`SELECT idTask, title, descripcion, isPublic, video, image 
    FROM task WHERE idTask = '`+randomId+`';`
    const [task] = await connection.executeZCQLQuery(query).then(queryResult => {
      return queryResult
    }).catch(err => {
      console.log('ERROR', err)
    });

    return task[0];
  }

  static async delete( id ) {
    const connection = await Database.connect(req);
    return  await connection.executeZCQLQuery(`DELETE FROM task WHERE idTask = '${id}'`).then(queryResult => {
      console.log('Resultado', queryResult)
      return queryResult
    }).catch(err => {
      console.log('Error in Delete Task', err)
      return null
    });
  }

  static async update(id, input) {
    const connection = await Database.connect(req);
    console.log(input)
    console.log( "Input :" + JSON.stringify(input) );
    
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
      const [result] = await connection.executeZCQLQuery(
        `UPDATE task SET ${updateFields} WHERE idTask = ${id};`
      );

      console.log( result );
  
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


  static async getAllbyCreator( req, id ) {
    const valor = userPrincipalModel.getROWIDuserPrincipal(req, id);
    // console.log('Valor de getAllByCreator', valor)
    const connection = await Database.connect(req);
    const [tasks] = await connection.query(`SELECT * FROM task WHERE idUP = ? ;` ,[id]);

    if (tasks.length === 0) return null;

    return tasks;
  }

  static async getROWIDTask(req, idTask){
    const connection = await Database.connect(req)
    return await connection.executeZCQLQuery(`select ROWID from task where idTask like '${idTask}' `).then( response => {
      console.log('IDTASK de GETROWIDTASK', response)

      return response
    }).catch(err=> {
      console.log('Error in getROWIDTask', err)
    })
  }
  
}

module.exports = { TaskModel };
