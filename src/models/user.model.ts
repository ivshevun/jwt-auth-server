import { User } from '@/interfaces'
import { Schema, model } from 'mongoose'

const userSchema = new Schema<User>(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        isActivated: {
            type: Boolean,
            default: false,
        },
        activationLink: {
            type: String,
            required: true,
        },
        token: {
            type: Schema.Types.ObjectId,
            ref: 'Token',
        },
    },
    {
        timestamps: true,
    }
)

export const UserModel = model<User>('User', userSchema)
