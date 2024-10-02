
import { Router } from 'express'
import userRouter from './users.js'
const adminRouter = Router()

const timeLog = (req, res, next) => {
    console.log('Admin')
    next()
}

adminRouter.use(timeLog)

//Defining home for amdin
adminRouter.get('/', (req, res) => {
    res.send('Pantalla de inicio para un admin')
   
})

//Defining html methods

adminRouter.route('/panel')
.get( (req, res) =>{
    res.send('Getting user')
})
.post( (req,res) => {
    res.send('Posting user')
})
.put( (req, res) => {
    res.send('Putting update to user')
})

export default adminRouter