const { Database } = require( "../middleware/conection")


class asignMasterModel {

  static async getAll( req ) {
    const connection = await Database.connect(req);
    const [users] = await connection.executeZCQLQuery(`SELECT * FROM userPrincipal_Tutee`);
    console.log(users)
    if (users.length === 0) throw new Error(' Asigin Master no found');;

    return users;
  }

  static async getAllbyUP( req, idUP ) {
    
    const connection = await Database.connect(req);

    let query = `select ROWID from userPrincipal where idUP = '${idUP}'`
    const rowIDUP = await connection.executeZCQLQuery(query).then(queryResult => {
      console.log(queryResult)
      if(queryResult)
        return queryResult[0].userPrincipal.ROWID
      return null
      
    }).catch(err => {
      console.log('Erorr in getting ROWIDTask', err)
    })

    query = `SELECT idUP, idUT FROM userPrincipal_Tutee WHERE  idUP = ${rowIDUP};`
    const [asignMaster] = await connection.executeZCQLQuery(query).then(queryResult => {
     console.log(queryResult)
      if(queryResult)
        return queryResult
    }).catch(err=> {
      console.log('Error in select idUP fK', err)
    });
    

    if(Array.isArray(asignMaster)) console.log('Si es un arreglo')
    // const keys = Object.keys(input);
    // const values = Object.values(input);
    
// Check if queryResult is wrapped in an object, e.g., { data: [...] }
  // idUTValues = asignMaster.data //? asignMaster.data.map(entry => entry.userPrincipal_Tutee.idUT) : [];
  //  console.log(idUTValues);


    if ( asignMaster.length === 0 ) throw new Error(' Asigin Master no found');
    const keys = Object.keys(asignMaster)
    const valor = Object.values(asignMaster)

    console.log(Object.values ( Object.values( valor ) ) )
    console.log(keys)
    //const idsUT = asignMaster.map(item => item.idUT);
    //const idUTValues = asignMaster.map(entry => entry.userPrincipal_Tutee.idUT)
    //console.log(idUTValues)
    const [userTutees] = await connection.executeZCQLQuery(
      `SELECT * FROM userTutee WHERE idUT IN (?);`,
      [idsUT]
    );

    return userTutees;

    //return asignMaster

  }

  static async getAllbyUT( idUT  ) {
    
    const connection = await Database.connect();
    const [assignMaster] = await connection.query(`SELECT idUP FROM userPrincipal_Tutee WHERE  idUT = ?;`, [idUT]);
    
   

    if ( assignMaster.length === 0 ) throw new Error(' Asigin Master no found');

    const idsUP = asignMaster.map(item => item.idUP);


    const [userTutees] = await connection.query(
      `SELECT * FROM userPrincipal WHERE idUP IN (?);`,
      [idsUP]
    );

    return userTutees;

  }

  static async create( input ) {

    const {
      idUP,
      idUT
    } = input;
    
    const connection = await Database.connect();
    const [master] = await connection.query(`SELECT * FROM userPrincipal WHERE idUP = ?;`, [ idUP ]);
    
    const findMaster =  master[0]
 
    
    if (!findMaster )  throw new Error('master no found');

    const [UT] = await connection.query(`SELECT * FROM userTutee WHERE idUT = ?;`, [ idUT ]);


    const findUT = UT[0]
    if (!findUT)  throw new Error('user tutee no found');

    
    try  {
      await connection.query(
        `INSERT INTO userPrincipal_Tutee (idUT, idUP  ) 
        VALUES (?, ?);`,
        [ idUT, idUP]
      );
    }catch (e){
      console.log(e)
      throw new Error('Error asigning master');
    }

    const [asign] = await connection.query(`SELECT * FROM userPrincipal_Tutee WHERE idUP = ? AND idUT = ?;`, [ idUP , idUT ]);
    return asign[0];
   
  }

  static async delete( idUP , idUT ) {

    const connection = await Database.connect();
    const [asignMaster] = await connection.query(`SELECT * FROM userPrincipal_Tutee WHERE idUP = ? and idUT = ?;`, [ idUP , idUT]);
    
    const findAsignMaster =  asignMaster[0]

    if ( !findAsignMaster ) throw new Error(' Master Assign no found');
    
    const [result] = await connection.query(`DELETE FROM userPrincipal_Tutee WHERE idUP = ? and idUT = ?;`, [ idUP , idUT]);

    if (result.affectedRows === 0) return null;

    return { message: ' Master Assign deleted successfully' };
  }






  
}

module.exports = { asignMasterModel };
