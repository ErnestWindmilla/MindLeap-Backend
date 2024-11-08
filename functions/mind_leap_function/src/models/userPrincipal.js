const { Database } = require( "../middleware/conection")
const bcrypt = require ('bcrypt')
const crypto = require('crypto')
class userPrincipalModel {
  static async getAll(req) {
    const connection = await Database.connect(req);
   return  await connection.executeZCQLQuery(`SELECT * FROM userPrincipal;`).then(queryResult => {
      console.log(queryResult)
      
        return queryResult;
  }).catch(err => {
    console.log('Error en getAll en UserPrincipalModel', err)
  })
  }
  static async getById( req, id ) {
    const zcql = await Database.connect(req);
    const query = `SELECT * FROM userPrincipal where userPrincipal.idUP = '${id}';`
    const users = await zcql.executeZCQLQuery(query)
    if(users==false){
      console.log(users)
      console.log(id)
      return "User Not Found";      
      }
    return users[0].userPrincipal;
  }

  static async create( req, input ) {
    // console.log('SI ENTRA A CREATE')
    const {
      username,
      email,
      password
    } = input;
  
    const connection = await Database.connect(req);
    // console.log('SI HACE LA CONEXION', connection)
    let randomId;
    if (req){
      randomId = crypto.randomUUID();
    }

    const uuid = randomId;
    // console.log('Si genera el UUID', uuid)
    const hashedPassword = await bcrypt.hash( password, parseInt(process.env.SALT_ROUNDS ) )
    // console.log('INPUT IN CREATE FUCNTION', input)
    await connection.executeZCQLQuery(`INSERT INTO userPrincipal (idUP, username , email, password) 
          VALUES ('` + uuid + `', '` + username + `', '` + email + `', '` + hashedPassword + `');`).then(response => {
            console.log(response)
          }).catch(e => {
            console.log('Error in insertion', e)
          })
    
    return await connection.executeZCQLQuery(
      `SELECT idUP, username , email, password
      FROM userPrincipal WHERE idUP = ${uuid};`,
    ).catch(err => {
      console.log('New user show error', err)
    });
    
  }

  static async delete( req, id ) {
    const zcql = await Database.connect(req);
    let query = `SELECT * FROM userPrincipal WHERE idUP = ${id};`
    return await zcql.executeZCQLQuery(query).then(
      selectResult => {
        const affectedRows = selectResult.length;
        //Delete
        console.log(affectedRows);
        if(affectedRows === 0) return null
        
        query =  `DELETE FROM userPrincipal WHERE idUP = '${id}';`
        zcql.executeZCQLQuery(query).then(updateResult => {
          console.log(updateResult)
          return { message: 'User Principal deleted successsfully' }
        }).catch(err => {
          console.log('Error in Delete query', err)
        })
      }
    ).catch(err => {
      console.log('User Not Found', err)
    });


  }

  static async update(req, id, input) {
    const zcql = await Database.connect(req)
  
      if ( input.password ){
        input.password =  await bcrypt.hash( input.password , parseInt(process.env.SALT_ROUNDS )  )
      }
  
      const keys = Object.keys(input);
      const values = Object.values(input);
      
      if (keys.length === 0) {
        throw new Error('No fields to update');
      }
    
      const setClause = keys.map(key => `${key} = ?`).join(', ');

      try {
  
     const query = `Select * FROM userPrincipal WHERE idUP = '${id}'`;
   
     const updateFields = Object.keys(input)
              .map(key => `${key} = '${input[key]}'`)
              .join(', ');

        const [result] = await zcql.executeZCQLQuery(query).then(resultQuery => {
            let cosa = `UPDATE userPrincipal SET ${updateFields} WHERE idUP = '${id}';`;
            console.log(cosa)
          let update = zcql.executeZCQLQuery(cosa).then(queryResult=>{
            return queryResult
          }).catch(err => {
            console.log('Error in Update query', err);
          });
          return update;
          }).catch(err => {
            console.log('Error in select query:', err);
        });
        console.log(result)
        return result[0];
      } catch (e) {
          throw new Error('Error updating User Principal');
      }
  }


  static async login( req, username, password ) {

    const connection = await Database.connect(req);

    return await connection.executeZCQLQuery(`SELECT * FROM userPrincipal WHERE username = '${username}';`).then(queryResult =>{
      
      console.log(queryResult[0])
      if (!queryResult )  throw new Error('User no Found');

      console.log('PASSWORD a pasar', password)
      console.log('PASSWORD DE USER PRINCIPAL', queryResult[0].userPrincipal.password)
      const isValid =  bcrypt.compare( password , queryResult[0].userPrincipal.password )
      if (!isValid )  throw new Error('Passoword Incorrect');
      return  queryResult[0].userPrincipal
    }).catch(err => {
      console.log('Error in login function', err)
    });
  }  

  static async getROWIDuserPrincipal(req, idUP){

 
    const connection = await Database.connect(req);

    // if(!idUP==null || idUP==undefined){
    //   idUp = await connection
    // }

    return await connection.executeZCQLQuery(`select ROWID from userPrincipal where idUP like '${idUP}'`).then(response => { 
    
      let id = response[0].userPrincipal.ROWID
      // console.log('DATOS DE GETROWIDUP', id)
      return id
    
    }).catch(err => { console.log('Error in getROWID', err)})
  }
}
module.exports = { userPrincipalModel };