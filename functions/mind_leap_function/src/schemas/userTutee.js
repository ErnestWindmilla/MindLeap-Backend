const z = require('zod')

const userTuteeSchema = z.object({
  username: z.string({ required_error: 'Username is required' , invalid_type_error: 'Username must be a string' })
            ,

  email: z.string( {  required_error: 'Email is required' , invalid_type_error: 'password must be a string'  }),

  password: z.string({    invalid_type_error: 'password must be a string',  })
             .min(6 , { message: "Must be 6 or more characters long" }),

  //idUP: z.string( { invalid_type_error: 'User Principal must be a string', required_error: 'User Principal id is required'} )

             
  
})

function validateUserTutee (input) {
  return userTuteeSchema.safeParse(input)
}

function validatePartialUserTutee (input) {
  return userTuteeSchema.partial().safeParse(input)
}

module.exports = { validateUserTutee , validatePartialUserTutee };