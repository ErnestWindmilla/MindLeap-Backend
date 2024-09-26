const express = require("express")
const router = express.Router()
const adminRouter = require('./admin')
const userRouter = require('./users')
const loginRouter = require('./login')

router.use('/admin',adminRouter)
router.use('/users',userRouter)
router.use('/login',loginRouter)
module.exports = router