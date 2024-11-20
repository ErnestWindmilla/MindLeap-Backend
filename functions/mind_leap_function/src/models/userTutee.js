const { query } = require("express");
const { Database } = require( "../middleware/conection")
const bcrypt = require ('bcrypt')
var crypto = require('crypto');

class userTuteeModel {

  static async getAll(req) {
    const app = await Database.connect(req)
    const connection = await app.zcql();
    return await connection.executeZCQLQuery(`SELECT * FROM userTutee;`).then(queryResult => {
      if(queryResult){
        const valor = queryResult
        const mapeado = valor.map(item => item.userTutee)
        return mapeado

      }
      return null
    }).catch(err => {
      console.log('Error in get all userTutee', err)
    });

    // if (users.length === 0) return null;

    // return users;
  }

  static async getById( req, id ) {
    const value = id
    const app = await Database.connect(req)
    const connection = await app.zcql();
    return await connection.executeZCQLQuery(`SELECT * FROM userTutee WHERE idUT = '${value}'`).then(queryResult => {
      if(queryResult){
        const valor = queryResult
        const mapeado = valor.map(item => item.userTutee)
        return mapeado
      }
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
    console.log(input)
    const app = await Database.connect(req)
    const connection = await app.zcql();

    let randomId;
    if (req){
      randomId = crypto.randomUUID();
    }
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

  
  }

  static async delete( req, id ) {
    const app = await Database.connect(req)
    const connection = await app.zcql();

    return await connection.executeZCQLQuery(`DELETE FROM userTutee WHERE idUT like '${id}'`).then(queryResult => {
      if(queryResult){
        const valor = queryResult
        const mapeado = queryResult[0].userTutee.DELETED_ROWS_COUNT
        if(mapeado > 0)
          return {message: `User Tutee deleted`}
        else 
        return {message: `User Tutee NOT DELETED`}
          
      }
    }).catch(err => {
      console.log("Error in delete Tutee", err)
    });

  }
  

  static async update(req, id, input) {
    const app = await Database.connect(req)
    const connection = await app.zcql();

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


      const query  = `UPDATE userTutee SET ${updateFields} WHERE idUT like '${id}'`
      console.log(query)
      const result = await connection.executeZCQLQuery(query).then(queryResult => {
        if(queryResult){
          const valor = queryResult
          const mapeado = valor.map(item => item.userTutee)
          return mapeado
        }
        return null
      }).catch(err => {
        console.log('Error in upodate',err)
      });

      console.log( result );
  
      // if (result.affectedRows === 0) {
      //   throw new Error('user tutee not found or no changes made');
      // }
  
      return await connection.executeZCQLQuery(
        `SELECT idUT, username , email, password
         FROM userTutee WHERE idUT like '${id}';`).then(queryResult => {
          console.log(queryResult)
          if(queryResult){
            const valor = queryResult
            const mapeado = valor.map(item=> item.userTutee)
            return mapeado
          }
          return null
         }).catch(err => {
          console.log('Error in getting userTutte', err)
         });
  
  }

  static async login( req, username, password ) {

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

  }



  static async getROWIDTuTee(req, idUT){
    const app = await Database.connect(req)
    const connection = await app.zcql();

      return await connection.executeZCQLQuery(`Select ROWID from userTutee where idUT like '${idUT}'`).then(response => {
        // console.log('EL OTRO ROWID', response[0].userTutee.ROWID)
        if(response){
          console.log('RETURN VALUE DE GETEOWIDTUTEE', response)
          return response[0].userTutee.ROWID
        }
        return null
      }).catch(err => {
        console.log('Error in getROWIDTutee',err)
      })
  }
  
}

module.exports = { userTuteeModel };