import { ApiError } from '@/exceptions'
import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
) => {
    console.log({ name: err.name, message: err.message })

    if (err instanceof ApiError) {
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors })
    }

    return res.status(500).json({ message: 'Unknown error' })
}
