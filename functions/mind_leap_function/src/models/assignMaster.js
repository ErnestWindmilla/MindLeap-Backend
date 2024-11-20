const { Database } = require( "../middleware/conection")
const { userTuteeModel } = require( "../models/userTutee")
const {userPrincipalModel} = require("../models/userPrincipal");
const { TaskModel } = require("./task");


class assignMasterModel {

  static async getAll(req){
    const query = 'Select * from userPrincipal_Tutee'
    const app = await Database.connect(req)
    const connection = await app.zcql();

    return await connection.executeZCQLQuery(query).then(response => {
      const valor = response
      const cadenaFinal = valor.map(item => item.userPrincipal_Tutee)
      return cadenaFinal
    })
  }

  static async getAllbyUT( req, idUT ) {
    const value = idUT
    const idROWidUT = await userTuteeModel.getROWIDTuTee(req, value)
    const app = await Database.connect(req)
    const connection = await app.zcql();
    return await connection.executeZCQLQuery(`select userPrincipal.* from userPrincipal 
join userPrincipal_Tutee as uPT on userPrincipal.ROWID = uPT.idUP 
where uPT.idUT = ${idROWidUT}`).then(response => {
  console.log('VALORES DE ALBUYT', response)      
  const valor = response
        const cadenaFInal = valor.map(item => item.userPrincipal)
        return cadenaFInal
      }).catch(err => {console.log('Error es igual a ', err)})
    
  }

  static async getAllbyUP( req, idUP ) {

    const valor = idUP
    // console.log('VAlor', valor)
    const rowIDUP = await userPrincipalModel.getROWIDuserPrincipal(req, valor);
    const app = await Database.connect(req)
    const connection = await app.zcql();

    const query = `select userTutee.* from userPrincipal_Tutee join userTutee on userTutee.ROWID = userPrincipal_Tutee.idUT where userPrincipal_Tutee.idUP = ${rowIDUP} `

  return await connection.executeZCQLQuery(query).then(resultQuery => {
    if(resultQuery){
      console.log(resultQuery)
      const valor = resultQuery
      const cadenaFinal = valor.map(item => item.userTutee)
      return cadenaFinal
    }
    return null
  }).catch(err => {
    console.log('Error in select in SUPERQUERY', err)
  })
  }

  static async getById(req,  idTask , idUT  ) {
    
    
    const app = await Database.connect(req)
    const connection = await app.zcql();

    const rowTask = await connection.executeZCQLQuery(`Select ROWID from task where idTask like '${idTask}'`).then(queryResult => {
      console.log(queryResult)
      if(queryResult)
        return queryResult[0].task.ROWID
      return null
    }).catch(err => {
      console.log('Error in rowTask query', err)
    })
    const rowUT= await connection.executeZCQLQuery(`Select ROWID from userTutee where idUT like '${idUT}'`).then(resultQuery => {
      console.log(resultQuery)
      if(resultQuery)
        return resultQuery[0].userTutee.ROWID
      return null
    }).catch(err =>{console.log('Error in query UT',err)})
    
    const SUPERQUERY = `select userTutee.username, assignTask.state, assignTask.dates,
task.image, task.descripcion, task.video from userTutee
INNER JOIN assignTask  on userTutee.ROWID = assignTask.idUT
INNER JOIN task on assignTask.idTask= task.ROWID
where userTutee.ROWID = ${rowUT} and task.ROWID = ${rowTask}`
    return await connection.executeZCQLQuery(SUPERQUERY).then(resultQuery => {
     console.log(resultQuery)
      if(resultQuery)
        return resultQuery
      return null
    }).catch(err => {
      console.log('Error in superquery', err)
    })
    

  }

  static async create( req, input ) {

    console.log('Entrando al modelo')
    const {idUT, idUP} = input;
    console.log(idUP)
    const getROWIDuserPrincipal = await userPrincipalModel.getROWIDuserPrincipal(req, idUP)
    const getROWIDuserTutee = await userTuteeModel.getROWIDTuTee(req, idUT);

    const app = await Database.connect(req)
    const connection = await app.zcql();

    // const valor = `select * from assignmaster where idUP = ${getROWIDuserPrincipal} and idUT = ${getROWIDuserTutee};`
    // const selectInicial = await connection.executeZCQLQuery(valor).then(response => {
    //   const value = response
    //   if(value.length > 1)
        
    // })
    let query = `INSERT INTO assignMaster (idUP, idUT) values (${getROWIDuserPrincipal}, ${getROWIDuserTutee})`
    console.log(query)
    return await connection.executeZCQLQuery(query).then(response => {
      console.log('Response de parte de assignMasdter', response)
      if(response){
        const valor = response
        const mapeado = valor.map(item => item.assignMaster)
        return mapeado
       }
      
    }).catch( err => {
      console.log('Error', err)
    });
   
  }

  static async delete( req, idUP , idUT ) {

    
    const app = await Database.connect(req)
    const connection = await app.zcql();
    // const zcql = connection.zcql()
    // const file = connection.filestore()

    const ROWIDprincipal = await userPrincipalModel.getROWIDuserPrincipal(req, idUP)
    const ROWIDtutee = await userTuteeModel.getROWIDTuTee(req, idUT)
    console.log('ENTRA AL DELETE')
  

    const query = `select * from assignMaster where idUP = ${ROWIDprincipal} and idUT = ${ROWIDtutee};`
    return  connection.executeZCQLQuery(query).then(resultQuery => {
      if(resultQuery)
        return connection.executeZCQLQuery(`delete from assignMaster where idUP = ${ROWIDprincipal} and idUT = ${ROWIDtutee}`).then(response => {
        return { message : `Changes done`}
        })
      return null
    }).catch(err => {
      console.log('Error in select query before delete ', err)
    })

  }
  
  static async getTutees(req, input){

    const idUP = await userPrincipalModel.getROWIDuserPrincipal(req, input)
    const app = await Database.connect(req)
    const connection = await app.zcql();

    console.log(idUP)
    const query = `select userTutee.*  from userTutee inner join userPrincipal_Tutee on userTutee.ROWID = userPrincipal_Tutee.idUT
          where userPrincipal_Tutee.idUP like '${idUP}'`
    return await connection.executeZCQLQuery(query).then(response => {
            if(response){
              console.log(response)
            const valor  = response
            const cadenaFinal = valor.map(item => item.userTutee);
            return cadenaFinal;
            }
            return null
          }).catch(err => {
            console.log('COnsole error from gettutees', err)
          })
  }
}


module.exports = { assignMasterModel };