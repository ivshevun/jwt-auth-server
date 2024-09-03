import 'dotenv/config'
import { Express } from 'express'
import mongoose from 'mongoose'

export const start = async (app: Express) => {
    await mongoose.connect(process.env.DATABASE_URL!)

    const PORT = process.env.PORT || 3000
    const server = app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
    )

    return server
}
