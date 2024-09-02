import { User } from '@prisma/client'

class MailService {
    async sendActivationMail(user: User) {
        const { email, activationLink } = user
    }
}

export const mailService = new MailService()
