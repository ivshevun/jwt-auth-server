import { ApiError } from '@/exceptions'
import { tokenService } from '@/services'
import { NextFunction, Request, Response } from 'express'

export const authMiddleware = (
    req: Request,
    res: Response,

    next: NextFunction
) => {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = authorization.split(' ')[1]

        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const user = tokenService.validateAccessToken(accessToken)

        if (!user) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = user
        next()
    } catch {
        next(ApiError.UnauthorizedError())
    }
}
