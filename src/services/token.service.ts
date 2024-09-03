import { UserDto } from '@/dtos'
import { TokenModel } from '@/models'
import 'dotenv/config'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import ms from 'ms'

class TokenService {
    generateTokens(payload: UserDto) {
        const accessToken = this.generateAccessToken(payload)
        const refreshToken = this.generateRefreshToken(payload)

        return { accessToken, refreshToken }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenInDb = await this.getTokenDataByUserId(userId)

        if (tokenInDb) {
            await this.updateRefreshTokenByUserId(userId, refreshToken)
        }

        const token = await this.createToken(userId, refreshToken)

        return token
    }

    saveRefreshTokenToCookie(refreshToken: string, res: Response) {
        res.cookie('refreshToken', refreshToken, {
            maxAge: ms('30d'),

            // This cookie won't be accessible from the browser
            httpOnly: true,
        })
    }

    generateAccessToken(payload: UserDto) {
        return jwt.sign({ user: payload }, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: '15m',
        })
    }

    generateRefreshToken(payload: UserDto) {
        return jwt.sign({ user: payload }, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: '30d',
        })
    }

    createToken(userId: string, refreshToken: string) {
        return TokenModel.create({
            userId,
            refreshToken,
        })
    }

    updateRefreshTokenByUserId(userId: string, refreshToken: string) {
        return TokenModel.findOneAndUpdate({ userId }, { refreshToken })
    }

    getTokenDataByUserId(userId: string) {
        return TokenModel.findOne({ userId })
    }
}

export const tokenService = new TokenService()
