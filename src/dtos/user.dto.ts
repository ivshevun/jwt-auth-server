import { User } from '@prisma/client'

export class UserDto {
    id: string
    email: string
    isActivated: boolean

    constructor(user: User) {
        this.id = user.id
        this.email = user.email
        this.isActivated = user.isActivated
    }
}
