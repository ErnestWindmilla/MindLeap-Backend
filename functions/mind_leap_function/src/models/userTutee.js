const { Database } = require( "../middleware/conection")
const bcrypt = require ('bcrypt')

class userTuteeModel {
  static async getAll() {
    const connection = await Database.connect();
    const [users] = await connection.query(`SELECT * FROM userTutee;`);

    if (users.length === 0) return null;

    return users;
  }

  static async getById( id ) {
    
    const connection = await Database.connect();
    const [user] = await connection.query(`SELECT * FROM userTutee WHERE idUT = ?;`, [ id ]);

    return user[0];
  }

  static async create( input ) {

    const {
      username,
      email,
      password
    } = input;

    const connection = await Database.connect();
    const [uuidResult] = await connection.query('SELECT UUID() as uuid;');
    const [{ uuid }] = uuidResult;

    const hashedPassword = await bcrypt.hash( password , parseInt(process.env.SALT_ROUNDS )  )
    try  {
      await connection.query(
        `INSERT INTO userTutee (idUT, username , email, password) 
        VALUES (?, ?, ?, ?);`,
        [uuid, username, email, hashedPassword]
      );
    }catch (e){
      console.log(e)
      //throw new Error('Error creating task');
    }
  
  

    const [userTutee] = await connection.query(
      `SELECT idUT, username , email, password
      FROM userTutee WHERE idUT = ?;`,
      [uuid]
    );

    return userTutee[0];
  }

  static async delete( id ) {
    const connection = await Database.connect();
    const [result] = await connection.query(`DELETE FROM userTutee WHERE idUT = ?;`, [id]);

    if (result.affectedRows === 0) return null;

    return { message: 'User Tutee deleted successfully' };
  }

  static async update(id, input) {
    const connection = await Database.connect();

    if ( input.password ){
      input.password =  await bcrypt.hash( input.password , parseInt(process.env.SALT_ROUNDS )  )
    }

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
        `UPDATE userTutee SET ${setClause} WHERE idUT = ?;`,
        [...values, id]
      );

      console.log( result );
  
      if (result.affectedRows === 0) {
        throw new Error('user tutee not found or no changes made');
      }
  
      
      const [updatedUT] = await connection.query(
        `SELECT idUT, username , email, password
         FROM userTutee WHERE idUT = ?;`,
        [id]
      );
  
      return updatedUT[0];
    } catch (e) {
      //console.log(e)
      throw new Error('Error updating User Tutee');
    }
  }

  static async login( username, password ) {

    const connection = await Database.connect();
    const  [user]  = await connection.query(`SELECT * FROM userTutee WHERE username = ?;`, [ username ]);

    const userTutee = user[0]

    if (!userTutee )  throw new Error('User no Found');


    const isValid = await bcrypt.compare( password , userTutee.password)
    

    if (!isValid )  throw new Error('Passoword Incorrect');

    
    return  userTutee


  }

  static async asignTask( idTask , idUT , date ) {
    
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
        [ idUT, idTask , date , false ]
      );
    }catch (e){
      console.log(e)
      throw new Error('Error asigning task');
    }

    const [asign] = await connection.query(`SELECT * FROM asingn_task WHERE idTask = ? AND idUT = ?;`, [ idTask , idUT ]);
    return asign[0];
  }


  // Edit Asigntask
  static async doneTask( idTask , idUT , input ) {
    
    const connection = await Database.connect();
    const [asignTask] = await connection.query(`SELECT * FROM asingn_task WHERE idTask = ? and idUT = ?;`, [ idTask , idUT]);
    
    const findAsignTask =  asignTask[0]
 
    
    if (!findAsignTask )  throw new Error('AsignTask no found');

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
        `UPDATE asingn_task SET ${setClause}  WHERE idTask = ? and idUT = ?;`,
        [...values, idTask , idUT]
      );

      console.log( result );
  
      if (result.affectedRows === 0) {
        throw new Error('user tutee not found or no changes made');
      }
  
      
      const [updatedUT] = await connection.query(
        `SELECT idUT, username , email, password
         FROM userTutee WHERE idUT = ?;`,
        [id]
      );
  
      return updatedUT[0];
    } catch (e) {
      //console.log(e)
      throw new Error('Error updating User Tutee');
    }
    
  
  }
  
  
}

module.exports = { userTuteeModel };
