import { Router } from "express"

const router = Router()

import adminRouter from './admin.js'
import userRouter from './users.js'
import loginRouter from './login.js'

router.use('/admin',adminRouter)
router.use('/users',userRouter)
router.use('/login',loginRouter)

export default router