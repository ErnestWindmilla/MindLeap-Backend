const DBLocal = require('db-local');
const { Schema } = new DBLocal({ path: './db' });

const bcrypt = require ('bcrypt')
SALT_ROUNDS = 10
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
    const hashedPassword = await bcrypt.hash( password ,SALT_ROUNDS  )

    User.create ( {
        _id :  id,
        username ,
        password : hashedPassword
    }).save()

    return id
  }

  static async login({ username, password }) {
    // Login logic here
    Validation.username( username )
    Validation.password( password )
    

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
    // Login logic here

    const user = User.find()
    return user


  }
}

class Validation {
    static username ( username ) {
        if (typeof username !== 'string') throw new Error('username must be a string');
        if (username.length < 3) throw new Error('username must be at least 3 characters long');
    }

    static password ( password ) {
        if (typeof password !== 'string') throw new Error('password must be a string');
        if (password.length < 6) throw new Error('password must be at least 6 characters long');
    }
}


module.exports = { UserRepository };
