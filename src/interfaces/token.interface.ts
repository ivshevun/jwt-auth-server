import { Types } from 'mongoose'

export interface Token {
    _id: Types.ObjectId
    userId: Types.ObjectId
    refreshToken: string
    createdAt: NativeDate
    updatedAt: NativeDate
}
