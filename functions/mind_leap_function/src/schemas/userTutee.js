const z = require('zod')

const userTuteeSchema = z.object({
  username: z.string({ required_error: 'Username is required' , invalid_type_error: 'Username must be a string' })
            ,

  email: z.string( {  required_error: 'Email is required' , invalid_type_error: 'password must be a string'  }),

  password: z.string({    invalid_type_error: 'password must be a string',  }).
  min(6 , { message: "Must be 5 or more characters long" })
  .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),

  //idUP: z.string( { invalid_type_error: 'User Principal must be a string', required_error: 'User Principal id is required'} )

             
  
})

function validateUserTutee (input) {
  return userTuteeSchema.safeParse(input)
}

function validatePartialUserTutee (input) {
  return userTuteeSchema.partial().safeParse(input)
}

module.exports = { validateUserTutee , validatePartialUserTutee };