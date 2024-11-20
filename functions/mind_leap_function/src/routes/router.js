const express = require("express")
const router = express.Router()
const userPrincipalRouter = require('./userPrincipal')
//const cors = require('cors');
const UserTuteeRouter = require("./userTutee")
const TaskRouter = require("./tasks" )
const asignTaskRouter = require('./asingnTasks')
const assignMasterRouter = require('./assignMaster')
const fs = require('fs');
const { sessionInfo } = require('../middleware/sessionInfo' )
const { join } = require('path');


const UPLOAD_DIR = join( __dirname, '../files');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

//check the session
router.use( sessionInfo );

//get Files
router.use('/files', express.static(UPLOAD_DIR));

//router.use('/admin',adminRouter)
router.use('/userPrincipal',userPrincipalRouter)
//router.use('',loginRouter)
router.use('/asignTask' ,asignTaskRouter )
router.use('/assignMaster' , assignMasterRouter )
router.use('/userTutee' , UserTuteeRouter)
router.use('/task' , TaskRouter )

module.exports = router