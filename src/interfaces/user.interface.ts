import { Types } from 'mongoose'

export interface User {
    _id: Types.ObjectId
    email: string
    hashedPassword: string
    isActivated: boolean
    activationLink: string
    token: Types.ObjectId
    createdAt: NativeDate
    updatedAt: NativeDate
}
