const express = require("express")
const router = express.Router()
const userPrincipalRouter = require('./userPrincipal')

const UserTuteeRouter = require("./userTutee")
const TaskRouter = require("./tasks" )
const asignTaskRouter = require('./asingnTasks')
const assignMasterRouter = require('./assignMaster')

const { sessionInfo } = require('../middleware/sessionInfo' )

//check the session
router.use( sessionInfo );


//router.use('/admin',adminRouter)
router.use('/userPrincipal',userPrincipalRouter)
//router.use('',loginRouter)
router.use('/asignTask' ,asignTaskRouter )
router.use('/assignMaster' , assignMasterRouter )
router.use('/userTutee' , UserTuteeRouter)
router.use('/task' , TaskRouter )

module.exports = router