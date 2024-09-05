import { User } from '@/interfaces'

export class UserDto {
    id: string
    email: string
    isActivated: boolean

    constructor(user: User) {
        console.log({ user })

        this.id = user._id.toString()
        this.email = user.email
        this.isActivated = user.isActivated
    }
}
