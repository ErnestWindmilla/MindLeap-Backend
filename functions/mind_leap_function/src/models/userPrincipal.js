const { Database } = require( "../middleware/conection")
const bcrypt = require ('bcrypt')

class userPrincipalModel {
  static async getAll() {
    const connection = await Database.connect();
    const [users] = await connection.query(`SELECT * FROM userPrincipal;`);

    if (users.length === 0) return null;

    return users;
  }

  static async getById( id ) {
    
    const connection = await Database.connect();
    const [user] = await connection.query(`SELECT * FROM userPrincipal WHERE idUP = ?;`, [ id ]);

   

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
        `INSERT INTO userPrincipal (idUP, username , email, password) 
        VALUES (?, ?, ?, ?);`,
        [uuid, username, email, hashedPassword]
      );
    }catch (e){
      console.log(e)
      //throw new Error('Error creating task');
    }
  
  

    const [userPrincipal] = await connection.query(
      `SELECT idUP, username , email, password
      FROM userPrincipal WHERE idUP = ?;`,
      [uuid]
    );

    return userPrincipal[0];
  }

  static async delete( id ) {
    const connection = await Database.connect();
    const [result] = await connection.query(`DELETE FROM userPrincipal WHERE idUP = ?;`, [id]);

    if (result.affectedRows === 0) return null;

    return { message: 'User Principal deleted successfully' };
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
        `UPDATE userPrincipal SET ${setClause} WHERE idUP = ?;`,
        [...values, id]
      );

      console.log( result );
  
      if (result.affectedRows === 0) {
        throw new Error('user  not found or no changes made');
      }
  
      
      const [updatedUP] = await connection.query(
        `SELECT idUP, username , email, password
         FROM userPrincipal WHERE idUP = ?;`,
        [id]
      );
  
      return updatedUP[0];
    } catch (e) {
      //console.log(e)
      throw new Error('Error updating User Principal');
    }
  }


  static async login( username, password ) {

    const connection = await Database.connect();
    const  [user]  = await connection.query(`SELECT * FROM userPrincipal WHERE username = ?;`, [ username ]);

    const userPrincipal = user[0]

    if (!userPrincipal )  throw new Error('User no Found');


    const isValid = await bcrypt.compare( password , userPrincipal.password)
    

    if (!isValid )  throw new Error('Passoword Incorrect');

    
    return  userPrincipal


  }


  
  
}

module.exports = { userPrincipalModel };
