import express from 'express'
import * as userController from '../controllers/userController.js'

const router = express.Router()

router.post('/', userController.createUser)
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)

export default router