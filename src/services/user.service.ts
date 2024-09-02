import { CreateUserDto, UserDto } from '@/dtos'
import { ApiError } from '@/exceptions'
import * as argon from 'argon2'
import * as uuid from 'uuid'
import { prisma } from '../utils'
import { mailService, tokenService } from './'

class UserService {
    async register(email: string, password: string) {
        const userInDb = await this.getUserByEmail(email)
        if (userInDb) {
            throw ApiError.BadRequest('User already exists')
        }
        const user = await this.createUser({ email, password })
        await mailService.sendActivationMail(user)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens(userDto)
        await tokenService.saveToken(user.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto
        const hashedPassword = await argon.hash(password)
        const activationLink = uuid.v4()

        return prisma.user.create({
            data: {
                email,
                hashedPassword,
                activationLink,
            },
        })
    }

    getUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } })
    }
}

export const userService = new UserService()
