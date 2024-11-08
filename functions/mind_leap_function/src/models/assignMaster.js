const { Database } = require( "../middleware/conection")
const { userTuteeModel } = require( "../models/userTutee")

class asignTaskModel {
  static async getAllbyUT( req, idUT ) {
    const connection = await Database.connect(req);
    const rowIDUT = await connection.executeZCQLQuery(`Select ROWID from userTutee where idUT like '${idUT}';`).then(resultQuery => {
      if(resultQuery)
        return resultQuery[0].userTutee.ROWID
    }).catch(err => {
      console.log('Error in ROWID select', err)
    })

    const query= `SELECT taskInfo.title, taskInfo.descripcion, taskInfo.isPublic, taskInfo.video,
    taskInfo.image, taskInfo.image, taskInfo.idUP FROM userTutee AS U
    INNER JOIN assignTask as userTask on U.ROWID = userTask.idUT
    INNER JOIN task as taskInfo on userTask.idTask = taskInfo.ROWID
    WHERE U.ROWID = ${rowIDUT}`

  return await connection.executeZCQLQuery(query).then(resultQuery => {
    if(resultQuery)
      return resultQuery
    return null
  }).catch(err => {
    console.log('Error in select in SUPERQUERY', err)
  })
  }

  static async getById(req,  idTask , idUT  ) {
    
    
    const connection = await Database.connect(req);

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

    const {
      idUT,
      idTask,
      date,
      state
    } = input;
    
    
    
    const connection = await Database.connect(req);
    const [task] = await connection.executeZCQLQuery(`SELECT * FROM task WHERE idTask = '${idTask}';`).then(resultQuery => {
      if(resultQuery)
        return resultQuery
      return null
    }).catch(err => {
      console.log('Error in select query in task', err)
    });
    
    const findTask =  task.task
 

    // console.log(findTask);
    if (!findTask )  throw new Error('task no found', findTask);

    const [UT] = await connection.executeZCQLQuery(`SELECT * FROM userTutee WHERE idUT = '${idUT}';`).then(queryResult => {
      if(queryResult)
        return queryResult
      return null
    }).catch(err => {
      console.log('Error in Select UT', err)
    });


    const findUT = UT.userTutee
    if (!findUT)  throw new Error('user tutee no found');

//QUERIES FOR ROWIDS 
  const rowIDTask = await connection.executeZCQLQuery(`select ROWID from task where idTask like '${idTask}';`).then(queryResult =>{
      //console.log(queryResult[0].task.idUP)
      if((queryResult))
        return queryResult[0].task.ROWID
      return null
      // return null
    }).catch(err => {console.log('Error getting rowid Principal', err)});

    console.log(rowIDTask)



   const rowIDuserTutee = await connection.executeZCQLQuery(`select ROWID from userTutee where idUT like '${idUT}';`).then(queryResult =>{
    //console.log(queryResult[0].userTutee.ROWID)  
    if(queryResult)
        return queryResult[0].userTutee.ROWID
      return null
    }).catch(err => {console.log('Error getting rowid Tutee', err)});
    
  //  console.log(rowIDuserTutee)
    let query = `INSERT INTO assignTask (idUT, idTask , dates , state ) VALUES (${rowIDuserTutee}, ${rowIDTask}, '${date}', ${state});`
    console.log(query)
     return await connection.executeZCQLQuery(query).then(resultQuery => {
          if(resultQuery)
            return connection.executeZCQLQuery(`SELECT * FROM assignTask WHERE idTask = ${rowIDTask} AND idUT = ${rowIDuserTutee};`).then(resultQuery => {
              if(resultQuery)
                return resultQuery
              return null
            }).catch(err=> {
              console.log('Error in select return value', err)
            })
        }).catch(err => {
          console.log('Eror in insertion query', err)
        });
    
   
  }

  static async delete( req, idTask , idUT ) {

    const connection = await Database.connect(req);

    
    let query = `select ROWID from task where idTask = '${idTask}'`
    const rowIDTask = await connection.executeZCQLQuery(query).then(queryResult => {
      console.log(queryResult)
      if(queryResult)
        return queryResult[0].task.ROWID
      return null
    }).catch(err => {
      console.log('Erorr in getting ROWIDTask', err)
    })
    
    query = `select ROWID from userTutee where idUT = '${idUT}'`
    const rowIDUT = await connection.executeZCQLQuery(query).then(queryResult => {
      if(queryResult)
        return queryResult[0].userTutee.ROWID
      return null
      
    }).catch(err => {
      console.log('Erorr in getting ROWIDTask', err)
    })

    console.log(rowIDUT)

    query = `select * from assignTask where idTask = ${rowIDTask} and idUT = ${rowIDUT};`
    return  connection.executeZCQLQuery(query).then(resultQuery => {
      if(resultQuery)
        return connection.executeZCQLQuery(`delete from assignTask where idTask = ${rowIDTask} and idUT = ${rowIDUT}`)
      return null
    }).catch(err => {
      console.log('Error in select query before delete ', err)
    })

  }

  static async update( idTask , idUT , input) {
    const connection = await Database.connect(req);

    console.log( input )
    const keys = Object.keys(input);
    const values = Object.values(input);
    
  
    // Verificar si hay campos para actualizar
    if (keys.length === 0) {
      throw new Error('No fields to update');
    }
  
    // Construir la consulta dinámicamente
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    console.log( setClause )
    console.log( values )

    const updateFields = Object.keys(input)
    .map(key => `${key} = '${input[key]}'`)
    .join(', ');

    console.log(updateFields)
    
    let query = `select ROWID from task where idTask = '${idTask}'`
    const rowIDTask = await connection.executeZCQLQuery(query).then(queryResult => {
      console.log(queryResult)
      if(queryResult)
        return queryResult[0].task.ROWID
      return null
    }).catch(err => {
      console.log('Erorr in getting ROWIDTask', err)
    })
    
    query = `select ROWID from userTutee where idUT = '${idUT}'`
    const rowIDUT = await connection.executeZCQLQuery(query).then(queryResult => {
      if(queryResult)
        return queryResult[0].userTutee.ROWID
      return null
      
    }).catch(err => {
      console.log('Erorr in getting ROWIDTask', err)
    })

    query = `select * from assignTask where idTask=${rowIDTask} and idUT = ${rowIDUT}`
    let updateQuery = `update assignTask set ${updateFields} where idTask=${rowIDTask} and idUT = ${rowIDUT}`
    //UPDATE userPrincipal SET ${updateFields} WHERE idUP = '${id}
    const result = await connection.executeZCQLQuery(query).then(queryResults => {
      console.log(queryResults)
      if(queryResults)
        return connection.executeZCQLQuery(updateQuery).then(queryResultado => {
          console.log(queryResultado)
          if(queryResultado)
            return queryResultado
          return null
        }).catch(err => {
          console.log('Error in updateQuery', err)
        })
      return null
    }).catch(err => {
      console.log('Error in query select', err)
    })
  }

  
}

module.exports = { asignTaskModel };