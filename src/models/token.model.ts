import { Token } from '@/interfaces'
import { model, Schema } from 'mongoose'

const tokenSchema = new Schema<Token>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            unique: true,
            required: true,
            ref: 'User',
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export const TokenModel = model<Token>('Token', tokenSchema)
