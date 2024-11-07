const z = require('zod')

const assignMasterSchema = z.object({

  idUT: z.string({ invalid_type_error: 'idUT must be a string',   required_error: 'idUT is required.'  }),

  idUP: z.string( {  required_error: 'idUP is required' , invalid_type_error: 'idUP must be a string'  }),

})

function validateAssignMaster (input) {
  return assignMasterSchema.safeParse(input)
}


module.exports = { validateAssignMaster };