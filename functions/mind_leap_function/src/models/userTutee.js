const { Database } = require( "../middleware/conection")
const bcrypt = require ('bcrypt')
const crypto = require ('crypto');
const { query } = require("express");
const { queryObjects } = require("v8");

class userTuteeModel {
  static async getAll(req) {
    const connection = await Database.connect(req);
    return await connection.executeZCQLQuery(`SELECT * FROM userTutee;`).then(queryResult => {
      if(queryResult)
        return queryResult
      return null
    }).catch(err => {
      console.log('Error in get all userTutee', err)
    });

    // if (users.length === 0) return null;

    // return users;
  }

  static async getById(req,  id ) {
    
    const connection = await Database.connect(req);
    return await connection.executeZCQLQuery(`SELECT * FROM userTutee WHERE idUT = ${id}`).then(queryResult => {
      if(queryResult)
        return queryResult
      return null
    }).catch(err => {
      console.log('Error getting user by id', err)
    })

  }

  static async create( req, input ) {

    const {
      username,
      email,
      password
    } = input;

    const connection = await Database.connect(req);

    let randomId;
    if (req){
      randomId = crypto.randomUUID();
    }

    //const [uuidResult] = await connection.query('SELECT UUID() as uuid;');
    //const [{ uuid }] = uuidResult;

    const hashedPassword = await bcrypt.hash( password , parseInt(process.env.SALT_ROUNDS )  )
    try  {
      await connection.executeZCQLQuery(
        `INSERT INTO userTutee (idUT, username , email, password) 
        VALUES ('${randomId}', '${username}', '${email}', '${hashedPassword}');`
      ).then(queryResult => {
        console.log(queryResult)
      }).catch(err => {
        console.log('Error in insertion of userTutee', err)
      });
    }catch (e){
      console.log(e)
      //throw new Error('Error creating task');
    }
  
  

    return await connection.executeZCQLQuery(
      `SELECT idUT, username , email, password
      FROM userTutee WHERE idUT = '${randomId}';`
    ).then(queryResult => {
      if(queryResult)
        return queryResult
      return null
    }).catch(err => {
      console.log('Error at getting userTutee', err)
    });

    return userTutee[0];
  }

  static async delete( req, id ) {
    const connection = await Database.connect(req);

    return await connection.executeZCQLQuery(`DELETE FROM userTutee WHERE idUT = ${id}`).then(queryResult => {
      return {message: 'User Tutee deleted'}
    }).catch(err => {
      console.log("Error in delete Tutee", err)
    });

    if (result.affectedRows === 0) return null;

    return { message: 'User Tutee deleted successfully' };
  }

  static async update(req, id, input) {
    const connection = await Database.connect(req);

    if ( input.password ){
      input.password =  await bcrypt.hash( input.password , parseInt(process.env.SALT_ROUNDS )  )
    }

    const keys = Object.keys(input);
    const values = Object.values(input);
    
    const updateFields = Object.keys(input)
    .map(key => `${key} = '${input[key]}'`)
    .join(', ');
  
    // Verificar si hay campos para actualizar
    if (keys.length === 0) {
      throw new Error('No fields to update');
    }
  
    // Construir la consulta dinámicamente
    const setClause = keys.map(key => `${key} = ?`).join(', ');


    try {
      const [result] = await connection.query(
        `UPDATE userTutee SET ${updateFields} WHERE idUT = ${id};`
      ).then(queryResult => {
        if(queryResult)
          return queryResult
        return null
      }).catch(err => {
        console.log('Error in updating userTutee', err)
      });

      console.log( result );
  
      // if (result.affectedRows === 0) {
      //   throw new Error('user tutee not found or no changes made');
      // }
  
      
      const [updatedUT] = await connection.executeZCQLQuery(
        `SELECT idUT, username , email, password
         FROM userTutee WHERE idUT = ${id};`).then(queryResult => {
          console.log(queryResult)
          if(queryResult)
            return queryResult
          return null
         }).catch(err => {
          console.log('Error in getting userTutte', err)
         });
  
      return updatedUT[0];
    } catch (e) {
      //console.log(e)
      throw new Error('Error updating User Tutee');
    }
  }

  static async login(req, username, password ) {

    const connection = await Database.connect(req);
    return await connection.executeZCQLQuery(`SELECT * FROM userTutee WHERE username = '${username}';`).then( queryResult => {
      if(!queryResult) throw new  Error('User Not Found')
      const isValid = bcrypt.compare(password, queryResult.password)
      console.log(queryResult)
      if(!isValid) throw new Error('Password Incorrect')
      
      return queryResult
    }).catch(err => {
      console.log('Error in select query', err)
    });

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
