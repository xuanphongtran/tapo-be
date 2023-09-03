import express from 'express'
import {
  getAllAccount,
  createAnAccount,
  getAccount,
  getAccountWithId,
  getEveryAccount,
  forgotPassword,
  updateNewPassword,
} from '../controller/Account.js'
const router = express.Router()

router.get('/', getEveryAccount)
router.post('/getAllAccount', getAllAccount)
router.post('/getAccount', getAccount)
router.get('/getAccountWithId/:Id', getAccountWithId)
router.post('/createAnAccount', createAnAccount)
router.post('/forgotPassword', forgotPassword)
router.put('/updateNewPassword', updateNewPassword)

export default router
