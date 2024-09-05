import { userController } from '@/controllers'
import { authMiddleware } from '@/middlewares'
import { Router } from 'express'

const router = Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/activate/:link', userController.activate)
router.get('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

export default router
