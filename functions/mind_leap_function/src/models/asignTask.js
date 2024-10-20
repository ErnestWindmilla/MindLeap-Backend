const { Database } = require( "../middleware/conection")


class asignTaskModel {
  static async getAllbyUT( idUT ) {
    const connection = await Database.connect();
    const [idtasks] = await connection.query(`SELECT idTask FROM asingn_task  WHERE idUT = ?;`, [idUT]);

    if (idtasks.length === 0) return null;


    //return users;

    const idsTask = idtasks.map(item => item.idTask);


    const [tasks] = await connection.query(
      `SELECT * FROM task WHERE idTask IN (?);`,
      [idsTask]
    );

    return tasks;
  }

  static async getById( idTask , idUT  ) {
    
    const connection = await Database.connect();
    const [asignTask] = await connection.query(`SELECT * FROM asingn_task WHERE idTask = ? AND idUT = ?;`, [ idTask , idUT]);
    
    const findAsignTask =  asignTask[0]

    if ( !findAsignTask ) throw new Error('asignTask no found');

    return findAsignTask

  }

  static async create( input ) {

    const {
      idUT,
      idTask,
      date,
      state
    } = input;
    
    const connection = await Database.connect();
    const [task] = await connection.query(`SELECT * FROM task WHERE idTask = ?;`, [ idTask ]);
    
    const findTask =  task[0]
 
    
    if (!findTask )  throw new Error('task no found');

    const [UT] = await connection.query(`SELECT * FROM userTutee WHERE idUT = ?;`, [ idUT ]);


    const findUT = UT[0]
    if (!findUT)  throw new Error('user tutee no found');

    
    try  {
      await connection.query(
        `INSERT INTO asingn_task (idUT, idTask , date , state ) 
        VALUES (?, ?, ?, ?);`,
        [ idUT, idTask , date , state ]
      );
    }catch (e){
      console.log(e)
      throw new Error('Error asigning task');
    }

    const [asign] = await connection.query(`SELECT * FROM asingn_task WHERE idTask = ? AND idUT = ?;`, [ idTask , idUT ]);
    return asign[0];
   
  }

  static async delete( idTask , idUT ) {

    const connection = await Database.connect();
    const [asignTask] = await connection.query(`SELECT * FROM asingn_task WHERE idTask = ? and idUT = ?;`, [ idTask , idUT]);
    
    const findAsignTask =  asignTask[0]

    if ( !findAsignTask ) throw new Error('asignTask no found');
    
    const [result] = await connection.query(`DELETE FROM asingn_task WHERE idTask = ? and idUT = ?;`, [ idTask , idUT]);

    if (result.affectedRows === 0) return null;

    return { message: ' asignTask deleted successfully' };
  }

  static async update( idTask , idUT , input) {
    const connection = await Database.connect();


    const keys = Object.keys(input);
    const values = Object.values(input);
    
  
    // Verificar si hay campos para actualizar
    if (keys.length === 0) {
      throw new Error('No fields to update');
    }
  
    // Construir la consulta dinámicamente
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    console.log( setClause )
    console.log( values )

    try {
      const [result] = await connection.query(
        `UPDATE asingn_task SET ${setClause} WHERE idUT = ? AND idTask = ?;`,
        [...values, idUT , idTask]
      );

      console.log( result );
  
      if (result.affectedRows === 0) {
        throw new Error('assign task not found or no changes made');
      }
  
      
      const [updatedAT] = await connection.query(
        `SELECT *
         FROM asingn_task WHERE idUT = ? AND idTask = ?;`,
        [idUT , idTask]
      );
  
      return updatedAT[0];
    } catch (e) {
      console.log(e.message)
      throw new Error('Error updating User Tutee');
    }
  }




  
}

module.exports = { asignTaskModel };
