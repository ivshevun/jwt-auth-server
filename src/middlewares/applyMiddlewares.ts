import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'

export const applyMiddleWares = (app: Express) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(morgan('dev'))
    app.use(cors())
    app.use(cookieParser())
}
