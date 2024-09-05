import { userController } from '@/controllers'
import { Router } from 'express'

const router = Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/activate/:link', userController.activate)
router.get('/logout', userController.logout)
router.get('/refresh')
router.get('/users')

export default router
