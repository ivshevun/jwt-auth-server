import { User } from '@/interfaces'

class MailService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendActivationMail(_user: User) {
        // const { email, activationLink } = user
    }
}

export const mailService = new MailService()
