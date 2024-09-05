import { CreateUserDto, UserDto } from '@/dtos'
import { ApiError } from '@/exceptions'
import { User } from '@/interfaces'
import { UserModel } from '@/models'
import { getActivationLinkByActivationId } from '@/utils/get-activation-link-by-activation-id'
import * as argon from 'argon2'
import * as uuid from 'uuid'
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

    async login(email: string, password: string) {
        const userInDb = await this.getUserByEmail(email)

        if (!userInDb) {
            throw ApiError.BadRequest('User not found')
        }

        const isValidPassword = await argon.verify(
            userInDb.hashedPassword,
            password
        )

        if (!isValidPassword) {
            throw ApiError.BadRequest('Incorrect password')
        }

        const userDto = new UserDto(userInDb)

        // Delete old token from db
        await tokenService.removeTokenByUserId(userDto.id)

        const tokens = tokenService.generateTokens(userDto)

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, userDto }
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeTokenFromDb(refreshToken)
        return token
    }

    async activate(activationId: string) {
        const user = await UserModel.findOne({
            activationLink: getActivationLinkByActivationId(activationId),
        })
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true
        await user.save()
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userPayload = tokenService.validateRefreshToken(refreshToken)
        const tokenInDb =
            await tokenService.getTokenByRefreshToken(refreshToken)

        if (!userPayload || !tokenInDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await this.getUserById(userPayload._id)

        if (!user) {
            throw ApiError.UnauthorizedError()
        }

        const userDto = new UserDto(user!)
        const tokens = tokenService.generateTokens(userDto)

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto
        const hashedPassword = await argon.hash(password)
        const activationLinkId = uuid.v4()
        const activationLink = `${process.env.API_URL}/api/activate/${activationLinkId}`

        return UserModel.create({
            email,
            hashedPassword,
            activationLink,
        })
    }

    async getAllUsers(): Promise<User[]> {
        return await UserModel.find()
    }

    getUserByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({ email }).exec()
    }

    async getUserById(id: string): Promise<User | null> {
        return await UserModel.findById(id)
    }
}

export const userService = new UserService()
