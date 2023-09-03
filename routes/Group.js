import express from 'express'
import { getAllGroup, createGroup, joinGroup, leaveGroup } from '../controller/Group.js'
const router = express.Router()

router.post('/getAllGroup', getAllGroup)
router.post('/createGroup', createGroup)
router.put('/joinGroup', joinGroup)
router.put('/leaveGroup', leaveGroup)
export default router
