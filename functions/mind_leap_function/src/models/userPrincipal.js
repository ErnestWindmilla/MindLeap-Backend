const { Database } = require( "../middleware/conection")
const bcrypt = require ('bcrypt')
const crypto = require('crypto')
class userPrincipalModel {


  static async getAll(req) {
    const app = await Database.connect(req)
    const connection = await app.zcql();
   return  await connection.executeZCQLQuery(`SELECT * FROM userPrincipal;`).then(queryResult => {
      console.log(queryResult)
      if(queryResult)
      {
        const valor = queryResult
        const mapeado = valor.map(item => item.userPrincipal)
        return mapeado
      }
        return null;
  }).catch(err => {
    console.log('Error en getAll en UserPrincipalModel', err)
  })
  }


  static async getById( req, id ) {
    const app = await Database.connect(req)
    const connection = await app.zcql();
    const query = `SELECT * FROM userPrincipal where userPrincipal.idUP = '${id}';`
    const users = await connection.executeZCQLQuery(query)
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
  
    const app = await Database.connect(req)
    const connection = await app.zcql();
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
      FROM userPrincipal WHERE idUP like '${uuid}';`,
    ).then(response => {
      const valor = response
      const mapeado = response.map(item => item.userPrincipal)
      return mapeado
    }).catch(err => {
      console.log('New user show error', err)
    });
    
  }

  static async delete( req, id ) {
    const app = await Database.connect(req)
    const connection = await app.zcql();
    console.log(id)
    return await connection.executeZCQLQuery(`DELETE FROM userPrincipal WHERE idUP like '${id}'`).then(queryResult => {
      if(queryResult){
        const valor = queryResult
        const mapeado = queryResult[0].userPrincipal.DELETED_ROWS_COUNT
        if(mapeado > 0)
          return {message: `User Principal deleted`}
        else 
        return {message: `User Principal NOT DELETED`}
          
      }
    }).catch(err => {
      console.log("Error in delete Principal", err)
    });


  }

  static async update(req, id, input) {
    const app = await Database.connect(req)
    const connection = await app.zcql();
    console.log('input', input)
      if ( input.password ){
        input.password =  await bcrypt.hash( input.password , parseInt(process.env.SALT_ROUNDS )  )
      }
      
      const keys = Object.keys(input);
      const values = Object.values(input);
      
      if (keys.length === 0) {
        throw new Error('No fields to update');
      }
    
      const setClause = keys.map(key => `${key} = ?`).join(', ');

     
  
     const query = `Select * FROM userPrincipal WHERE idUP like '${id}'`;
        console.log(query)
     const updateFields = Object.keys(input)
              .map(key => `${key} = '${input[key]}'`)
              .join(', ');

        return await connection.executeZCQLQuery(query).then(resultQuery => {
            let cosa = `UPDATE userPrincipal SET ${updateFields} WHERE idUP like '${id}';`;
            console.log(cosa)
            return connection.executeZCQLQuery(cosa).then(queryResult=>{
            const valor = queryResult
            const mapeado = valor.map(item=>item.userPrincipal)
            console.log('Mapeado', mapeado[0])
            return mapeado[0]
          }).catch(err => {
            console.log('Error in Update query', err);
          });
          
          }).catch(err => {
            console.log('Error in select query:', err);
        });
        console.log(result)
        return result[0];

  }


  static async login( req, username, password ) {

    const app = await Database.connect(req)
    const connection = await app.zcql();

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

    const app = await Database.connect(req)
    const connection = await app.zcql();

    return await connection.executeZCQLQuery(`select ROWID from userPrincipal where idUP like '${idUP}'`).then(response => { 
      if(response){
        console.log(response)
        return response[0].userPrincipal.ROWID
      }
      return null

    
    }).catch(err => { console.log('Error in getROWID', err)})
  }
}
module.exports = { userPrincipalModel };