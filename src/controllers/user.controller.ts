import { ApiError } from '@/exceptions'
import { createUserSchema } from '@/schemas'
import { tokenService, userService } from '@/services'
import { NextFunction, Request, Response } from 'express'

class UserController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = createUserSchema.safeParse(req.body)
            if (!validation.success) {
                throw ApiError.BadRequest(
                    validation.error.message,
                    validation.error.errors
                )
            }

            const userData = await userService.register(
                req.body.email,
                req.body.password
            )

            tokenService.saveRefreshTokenToCookie(userData.refreshToken, res)

            return res.status(201).json(userData)
        } catch (error) {
            next(error)
        }
    }
    // async login(req: Request, res: Response, next: NextFunction) {
    //     try {
    //     } catch (error) {}
    // }
    // async logout(req: Request, res: Response, next: NextFunction) {
    //     try {
    //     } catch (error) {}
    // }
    // async refresh(req: Request, res: Response, next: NextFunction) {
    //     try {
    //     } catch (error) {}
    // }

    // async activate(req: Request, res: Response, next: NextFunction) {
    //     try {
    //     } catch (error) {}
    // }

    // async getUsers(req: Request, res: Response, next: NextFunction) {
    //     try {
    //     } catch (error) {}
    // }
}

export const userController = new UserController()
