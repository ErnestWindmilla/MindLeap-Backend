const { Database } = require( "../middleware/conection")


class asignMasterModel {

  static async getAll(  ) {
    const connection = await Database.connect();
    const [users] = await connection.query(`SELECT * FROM userPrincipal_Tutee`);

    if (users.length === 0) throw new Error(' Asigin Master no found');;

    return users;
  }

  static async getAllbyUP( idUP ) {
    
    const connection = await Database.connect();
    const [asignMaster] = await connection.query(`SELECT idUT FROM userPrincipal_Tutee WHERE  idUP = ?;`, [idUP]);
    
  
    if ( asignMaster.length === 0 ) throw new Error(' Asigin Master no found');
    
    const idsUT = asignMaster.map(item => item.idUT);


    const [userTutees] = await connection.query(
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
