const z = require('zod')

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required.'
  }),

  email: z.string( {  required_error: 'Email is required' , invalid_type_error: 'password must be a string'  }),


  password: z.string({    invalid_type_error: 'password must be a string',  }).
  min(6 , { message: "Must be 5 or more characters long" })
  .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
  
})

function validateUser (input) {
  return userSchema.safeParse(input)
}


function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}

module.exports = { validateUser , validatePartialUser };