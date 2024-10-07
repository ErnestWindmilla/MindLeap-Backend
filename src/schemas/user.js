const z = require('zod')

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required.'
  }),

  password: z.string({    invalid_type_error: 'password must be a string',  }).
  min(6 , { message: "Must be 5 or more characters long" }),
  
})

function validateUser (input) {
  return userSchema.safeParse(input)
}

function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}

module.exports = { validateUser , validatePartialUser };