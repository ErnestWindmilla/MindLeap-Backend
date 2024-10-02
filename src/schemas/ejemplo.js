
// Ejemplo de validacion de datos usando zot

// zod libreraria poara vaildar
const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    // se puede agrear una descripcion segun el error
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required.'
  }),
  year: z.number().int().min(1900).max(2024), // concatenar validaciones
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({ // validar URL
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})

// valida que se le pasen todos los datos del schema y de manera correcta. Ignora lo demas
function validateMovie (input) {
  return movieSchema.safeParse(input)
}

// valida que los datos que se le pasaron cumplan , tomando los demas como opcionales . Ignora lo demas
function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}