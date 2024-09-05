import { User } from '@/interfaces'
import 'dotenv/config'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

class MailService {
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT!),
            secure: false, // use SSL
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }

    async sendActivationMail(user: User) {
        await this.transporter.sendMail({
            // Todo: change sending domain if production
            from: 'Ivan <ivan@demomailtrap.com>',
            to: user.email,
            subject: `Activate account on localhost`,
            text: '',
            html: `<a href="${user.activationLink}">Activate account</a>`,
        })
    }
}

export const mailService = new MailService()
