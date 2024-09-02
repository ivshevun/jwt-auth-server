import 'dotenv/config'
import { Express } from 'express'

export const start = (app: Express) => {
    const PORT = process.env.PORT || 3000
    const server = app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
    )

    return server
}
