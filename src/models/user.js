

const User = Schema('User', {
    _id: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
})

export class UserRepository {
    static create ({ username, password}){
        if(typeof username !== 'string') throw new Error('username must be a string')
        if(username.length < 3) throw new Error('username must be at least 3 characters long')
        
        if(typeof password != string) throw new Error('password must be a string')
        if(password.length < 6) throw new Error('password must be at least 6 characters long')
        
        const user = User.findOne({username})
        if(user) throw new Error('username already exists')

        
    }
}