const { Database } = require( "../middleware/conection")
const {userTuteeModel} = require("../models/userTutee")
const {userPrincipalModel} = require("../models/userPrincipal")
class asignMasterModel {

  static async getAll(req) {
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

  static async getAllbyUT(req,  idUT  ) {
    const valor = userTuteeModel.getROWIDTuTee(req, idUT)
    const connection = await Database.connect(req);
    const [assignMaster] = await connection.query(`SELECT idUP FROM userPrincipal_Tutee WHERE  idUT = ?;`, [idUT]);
    
   

    if ( assignMaster.length === 0 ) throw new Error(' Asigin Master no found');

    const idsUP = asignMaster.map(item => item.idUP);


    const [userTutees] = await connection.query(
      `SELECT * FROM userPrincipal WHERE idUP IN (?);`,
      [idsUP]
    );

    return userTutees;

  }

  static async create(req, input ) {

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

  static async delete( req, idUP , idUT ) {

    const connection = await Database.connect();
    const [asignMaster] = await connection.query(`SELECT * FROM userPrincipal_Tutee WHERE idUP = ? and idUT = ?;`, [ idUP , idUT]);
    
    const findAsignMaster =  asignMaster[0]

    if ( !findAsignMaster ) throw new Error(' Master Assign no found');
    
    const [result] = await connection.query(`DELETE FROM userPrincipal_Tutee WHERE idUP = ? and idUT = ?;`, [ idUP , idUT]);

    if (result.affectedRows === 0) return null;

    return { message: ' Master Assign deleted successfully' };
  }

  static async getTutees(req, idUP){
    const id = await userPrincipalModel.getROWIDuserPrincipal(req, idUP)

    console.log('IDUP de GETTUTEES', id)
    const connection = await Database.connect(req);
    const [asignMaster] = await connection.query(
      `Select ut.idUT, ut.username from userPrincipal_Tutee as up 
      inner join userTutee as ut on up.idUT = ut.idUT
      where up.idUP = '${id}'`).then(response => { console.log('respuesta esperada', response) 
        return response})
      console.log('POR FAOR',asignMaster)
      const findAsignMaster = asignMaster[0]
      console.log(asignMaster)
      if(! findAsignMaster) throw new Error('NOT FOUND');
      connection.destroy
      return [...asignMaster]
  }
  
}

module.exports = { asignMasterModel };
