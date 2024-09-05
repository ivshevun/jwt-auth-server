import { UserDto } from '@/dtos'
import { Token } from '@/interfaces'
import { TokenModel } from '@/models'
import 'dotenv/config'
import { Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
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

    async removeTokenFromDb(refreshToken: string) {
        return await TokenModel.deleteOne({ refreshToken })
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

    validateAccessToken(token: string) {
        try {
            const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)

            return user
        } catch {
            return null
        }
    }

    validateRefreshToken(token: string): JwtPayload | null {
        try {
            const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET!)

            return user as JwtPayload
        } catch {
            return null
        }
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

    async getTokenDataByUserId(userId: string): Promise<Token | null> {
        return await TokenModel.findOne({ userId })
    }

    getTokenById(id: string): Promise<Token | null> {
        return TokenModel.findById(id)
    }

    getTokenByRefreshToken(refreshToken: string): Promise<Token | null> {
        return TokenModel.findOne({ refreshToken })
    }

    async removeTokenByUserId(userId: string): Promise<Token | null> {
        return await TokenModel.findOneAndDelete({ userId })
    }
}

export const tokenService = new TokenService()
