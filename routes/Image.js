import express from 'express'
import getImage from '../controller/Image.js'
const router = express.Router()

router.get('/:Id', getImage)

export default router
