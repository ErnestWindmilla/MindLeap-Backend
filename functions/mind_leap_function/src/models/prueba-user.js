const DBLocal = require('db-local');
const { Schema } = new DBLocal({ path: './db' });
const bcrypt = require ('bcrypt')


const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

class UserRepository {
  static  async create({ username, password }) {
    // 1. validaciones de username (opcional: usar zod)
    //    Validation.username( username )
//    Validation.password( password )

   
    // 2. ASEGURARSE QUE EL USERNAME NOOOOO EXISTE
    const user = User.findOne( { username })
    if (user)  throw new Error('username already exist ');

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash( password , parseInt(process.env.SALT_ROUNDS )  )

    User.create ( {
        _id :  id,
        username ,
        password : hashedPassword
    }).save()

    return id
  }

  static async login({ username, password }) {

    const user = User.findOne( { username })
    if (!user )  throw new Error('User no Found');

    const isValid = bcrypt.compare( password , user.password)

    if (!isValid )  throw new Error('Passoword Incorrect');

    
    return {
        id : user.id,
        username : user.username
    }


  }

  static async all() {
  
    const user = User.find()
    return user

  }
}


module.exports = { UserRepository };
