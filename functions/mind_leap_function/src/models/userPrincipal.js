const { Database } = require( "../middleware/conection")
const bcrypt = require ('bcrypt')
const crypto = require('crypto')
//const catalyst = require('zcatalyst-sdk-node')

class userPrincipalModel {
  static async getAll(req) {
    
//////////////////////////////////////////////////////////////////////////////////////////////////////

    const zcql = await Database.connect(req);
    // const zcql = await datastore.zcql();
   return  await zcql.executeZCQLQuery(`SELECT * FROM userPrincipal;`).then(queryResult => {
      console.log(queryResult)
      //if(queryResult!=null)
        return queryResult;
      //lse{
       // return null
  })
    // console.log(users)
    // if(users.length === 0) return null;
    
    // //////////////////////////////////////////////////////////////////////////////////////////////////////

    // //const connection = await Database.connect();
    // //const [users] = await connection.query(`SELECT * FROM userPrincipal;`);

    // return [users];
  }

  static async getById( req, id ) {
    
//////////////////////////////////////////////////////////////////////////////////////////////////////

    const zcql = await Database.connect(req);
    // const zcql = await app.zcql();
    const query = `SELECT * FROM userPrincipal where userPrincipal.idUP = '${id}';`
    const users = await zcql.executeZCQLQuery(query)
    if(users==false){
    console.log(users)
    console.log(id)
    return "User Not Found";
    
    }
    return users;
//////////////////////////////////////////////////////////////////////////////////////////////////////



    const connection = await Database.connect();
    const [user] = await connection.query(`SELECT * FROM userPrincipal WHERE idUP = ?;`, [ id ]);

   

    return user[0];
  }

  static async create( req, input ) {
    
    const {
      username,
      email,
      password
    } = input;

//////////////////////////////////////////////////////////////////////////////////////////////////////

  const zcql = await Database.connect(req);
  // const zcql = app.zcql();
  let randomId;
  if (req){
    randomId = crypto.randomUUID();
  }

  // const [uuidResult] = await zcql.executeZCQLQuery(`SELECT UUID() as uuid;`);
  const uuid = randomId;

  const hashedPassword = await bcrypt.hash( password, parseInt(process.env.SALT_ROUNDS ) )
  try {

    await zcql.executeZCQLQuery(
      // `INSERT INTO userPrincipal (idUP, username , email, password) 
      //   VALUES (?, ?, ?, ?);` ,
        `INSERT INTO userPrincipal (idUP, username , email, password) 
        VALUES ('` + uuid + `', '` + username + `', '` + email + `', '` + hashedPassword + `');`
        // [uuid, username, email, hashedPassword]
    );
  }catch (e) {
    console.log(e)
  }

  const [userPrincipal] = await zcql.executeZCQLQuery(
    `SELECT idUP, username , email, password
    FROM userPrincipal WHERE idUP = ?;`,
    [uuid]
  );
//////////////////////////////////////////////////////////////////////////////////////////////////////


    //CHAMBA DE CESAR

    //const connection = await Database.connect();
    //const [uuidResult] = await connection.query('SELECT UUID() as uuid;');
    //const [{ uuid }] = uuidResult;

    // const hashedPassword = await bcrypt.hash( password , parseInt(process.env.SALT_ROUNDS )  )
    // try  {
    //   await connection.query(
    //     `INSERT INTO userPrincipal (idUP, username , email, password) 
    //     VALUES (?, ?, ?, ?);`,
    //     [uuid, username, email, hashedPassword]
    //   );
    // }catch (e){
    //   console.log(e)
    //   //throw new Error('Error creating task');
    // }
  
  

    // const [userPrincipal] = await connection.query(
    //   `SELECT idUP, username , email, password
    //   FROM userPrincipal WHERE idUP = ?;`,
    //   [uuid]
    // );

    return userPrincipal[0];

  }

  static async delete(req,  id ) {

    
///////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // const app = catalyst.initialize(req);
    // const zcql = app.zcql();
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


////////////////////////////////////////////////////////////////////////////////////////////////////////

    //const connection = await Database.connect();
    //const [result] = await connection.query(`DELETE FROM userPrincipal WHERE idUP = ?;`, [id]);

    if (result.affectedRows === 0) return null; //////////////FALTA VER ESTO NO HACER DELETES

    return { message: 'User Principal deleted successfully' };
  }

  static async update(req, id, input) {


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const zcql = await Database.connect(req)
  // const catalyst = require('zcatalyst-sdk-node');
    // const app = catalyst.initialize(req);
    // const zcql = app.zcql();

   const lid = id

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // const connection = await Database.connect();

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
    //console.log(setClause)

    try {

   const query = `Select * FROM userPrincipal WHERE idUP = '${id}'`;
 
   const updateFields = Object.keys(input)
            .map(key => `${key} = '${input[key]}'`)
            .join(', ');

  //  console.log(id);
   //console.log(query)

    
      const [result] = await zcql.executeZCQLQuery(query).then(resultQuery => {
          //console.log(resultQuery)
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
      //console.log(e)
      throw new Error('Error updating User Principal');
    }
  }


  static async login(req,  username, password ) {

    const zcql = await Database.connect(req);
    // const app = catalyst.initialize(req);
    // const zcql = app.zcql();
    return await zcql.executeZCQLQuery(`SELECT * FROM userPrincipal WHERE username = '${username}';`).then(queryResult =>{
      const userPrincipal = queryResult;
      console.log(queryResult)


      // const connection = await Database.connect();
      // const  [user]  = await connection.query(`SELECT * FROM userPrincipal WHERE username = ?;`, [ username ]);A
  
     // const userPrincipal = user[0]
  
      if (!queryResult )  throw new Error('User no Found');
  
      // console.log(password + '\n' + userPrincipal.password)
      const isValid =  bcrypt.compare( password , userPrincipal.password)
      
  
      if (!isValid )  throw new Error('Passoword Incorrect');
  
      
      return  userPrincipal




    });
    
    
    // console.log(userPrincipal)
    
    console.log(user.queryResult)


    // const connection = await Database.connect();
    // const  [user]  = await connection.query(`SELECT * FROM userPrincipal WHERE username = ?;`, [ username ]);A

   // const userPrincipal = user[0]

    if (!user.queryResult )  throw new Error('User no Found');

    // console.log(password + '\n' + userPrincipal.password)
    const isValid = await bcrypt.compare( password , userPrincipal.password)
    

    if (!isValid )  throw new Error('Passoword Incorrect');

    
    return  userPrincipal


  }


  
  
}

module.exports = { userPrincipalModel };
