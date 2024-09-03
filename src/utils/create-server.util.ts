import { applyMiddleWares, errorMiddleware } from '@/middlewares'
import { router } from '@/routes'
import express from 'express'

export const createServer = () => {
    const app = express()

    applyMiddleWares(app)

    // Use router
    app.use('/api', router)

    // Use error handler
    app.use(errorMiddleware)

    return app
}
