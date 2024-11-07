const z = require('zod')

const asignTaskShema = z.object({
  idUT: z.string({
    invalid_type_error: 'idUT must be a string',
    required_error: 'idUT is required.'
  }),

  idTask: z.string( {  required_error: 'idTask is required' , invalid_type_error: 'idTask must be a string'  }),


  date: z.string({  required_error: 'date is required' , invalid_type_error: 'date must be a string'  } ),
  state : z.boolean({ required_error: 'state is required' , invalid_type_error: 'state must be a boolean'  })

  
})

function validateAsignTask (input) {
  return asignTaskShema.safeParse(input)
}


function validatePartialAsignTask (input) {
  return asignTaskShema.partial().safeParse(input)
}

module.exports = { validatePartialAsignTask , validateAsignTask };