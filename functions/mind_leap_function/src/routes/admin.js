const express = require('express')
const userRouter = require('./users')
const adminRouter = express.Router()

const timeLog = (req, res, next) => {
    console.log('Admin')
    next()
}

adminRouter.use(timeLog)

//Defining home for amdin
adminRouter.get('/', (req, res) => {
    //res.send('Pantalla de inicio para un admin')
})

//Defining crud (?)

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

module.exports = adminRouter