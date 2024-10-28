const { Database } = require( "../middleware/conection")

class TaskModel {
  static async getAll() {
    const connection = await Database.connect();
    const [tasks] = await connection.query(`SELECT * FROM task;`);

    if (tasks.length === 0) return null;

    return tasks;
  }

  static async getById( id ) {
    
    const connection = await Database.connect();
    const [task] = await connection.query(`SELECT * FROM task WHERE idTask = ?;`, [ id ]);

   

    return task[0];
  }

  static async madeBy( idUP ) {
    
    const connection = await Database.connect();
    const [task] = await connection.query(`SELECT * FROM task WHERE idUP = ?;`, [ idUP ]);

   

    return task[0];
  }


  

  static async create( input ) {
    
    console.log( " Modelo ")

    const {
      title,
      descripcion,
      isPublic,
      video,
      image,
      idUP,
    } = input;

    console.log( " datos Optenidos  ")


    if ( !idUP )  idUP = "Admin"

    console.log( " idUP ", idUP )

    const connection = await Database.connect();
    const [uuidResult] = await connection.query('SELECT UUID() as uuid;');
    const [{ uuid }] = uuidResult;


    try  {
      await connection.query(
        `INSERT INTO task (idTask, title,descripcion, isPublic, video, image , idUP) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [uuid, title, descripcion, isPublic, video, image , idUP]
      );
    }catch (e){
      console.log( " ERROR MODELO ", e)
      throw new Error('Error creating task');
    }
  
  

    const [task] = await connection.query(
      `SELECT idTask, title, descripcion, isPublic, video, image 
      FROM task WHERE idTask = ?;`,
      [uuid]
    );

    return task[0];
  }

  static async delete( id ) {
    const connection = await Database.connect();
    const [result] = await connection.query(`DELETE FROM task WHERE idTask = ?;`, [id]);

    if (result.affectedRows === 0) return null;

    return { message: 'Task deleted successfully' };
  }

  static async update(id, input) {
    const connection = await Database.connect();
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


    try {
      const [result] = await connection.query(
        `UPDATE task SET ${setClause} WHERE idTask = ?;`,
        [...values, id]
      );

      console.log( result );
  
      if (result.affectedRows === 0) {
        throw new Error('Task not found or no changes made');
      }
  
      
      const [updatedTask] = await connection.query(
        `SELECT idTask, title, descripcion, isPublic, video, image 
         FROM task WHERE idTask = ?;`,
        [id]
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
