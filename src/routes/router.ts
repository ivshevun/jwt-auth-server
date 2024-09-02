import { userController } from '@/controllers'
import { Router } from 'express'

const router = Router()

router.post('/register', userController.register)
router.post('/login')
router.get('/activate/:link')
router.get('/refresh')
router.get('/users')

export default router
