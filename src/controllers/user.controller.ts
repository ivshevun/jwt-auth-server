import { ApiError } from '@/exceptions'
import { authSchema } from '@/schemas'
import { tokenService, userService } from '@/services'
import { NextFunction, Request, Response } from 'express'

class UserController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = authSchema.safeParse(req.body)
            if (!validation.success) {
                throw ApiError.BadRequest(
                    'Validation error',
                    validation.error.errors
                )
            }

            const createdUserWithTokens = await userService.register(
                req.body.email,
                req.body.password
            )

            tokenService.saveRefreshTokenToCookie(
                createdUserWithTokens.refreshToken,
                res
            )

            return res.status(201).json(createdUserWithTokens)
        } catch (error) {
            next(error)
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validation = authSchema.safeParse(req.body)

            if (!validation.success) {
                throw ApiError.BadRequest(
                    'Validation error',
                    validation.error.errors
                )
            }

            const { email, password } = req.body
            const userWithTokens = await userService.login(email, password)
            tokenService.saveRefreshTokenToCookie(
                userWithTokens.refreshToken,
                res
            )

            return res.json(userWithTokens)
        } catch (error) {
            next(error)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies
            // Next code might be in a separate function
            const userWithTokens = await userService.refresh(refreshToken)
            tokenService.saveRefreshTokenToCookie(
                userWithTokens.refreshToken,
                res
            )
            return res.json(userWithTokens)
        } catch (error) {
            next(error)
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL!)
        } catch (error) {
            next(error)
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }
}

export const userController = new UserController()
