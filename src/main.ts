import express from 'express'
import { applyMiddleWares, errorMiddleware } from './middlewares'
import { router } from './routes'
import { start } from './utils'

const app = express()

applyMiddleWares(app)

// Use router
app.use('/api', router)

// Use error handler
app.use(errorMiddleware)

const server = start(app)

export default server
