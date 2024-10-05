const express = require("express")
const router = express.Router()
const adminRouter = require('./admin')
const userRouter = require('./users')
const loginRouter = require('./login')
const catalyst = require('zcatalyst-sdk-node');

router.use('/admin',adminRouter)
router.use('/users',userRouter)
router.use('',loginRouter)
module.exports = router