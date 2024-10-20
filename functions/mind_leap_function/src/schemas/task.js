const z = require('zod')

const taskSchema = z.object({
  title: z.string({ required_error: 'Title is required' , invalid_type_error: 'Title must be a string' })
           ,
  descripcion : z.string({ required_error: 'descripcion is required' , invalid_type_error: 'descripcion must be a string' })
  ,
  video : z.string().url().optional(),

  image : z.string().url().optional(),

  isPublic : z.boolean({ required_error: 'public is required' , invalid_type_error: 'public must be a boolean' })

})

const date = z.date()

function validateTask (input) { 
  return taskSchema.safeParse(input)
}

function validatePartialTask(input) {
  return taskSchema.partial().safeParse(input)
}

function validateTaskDate (input) { 
  return date.safeParse(input)
}

module.exports = { validateTask , validatePartialTask  , validateTaskDate};