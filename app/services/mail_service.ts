import env from '#start/env'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport(
  env.get('NODE_ENV') === 'test' || env.get('NODE_ENV') === 'development'
    ? ({ jsonTransport: true } as any)
    : {
        host: env.get('SMTP_HOST'),
        port: env.get('SMTP_PORT'),
        auth: {
          user: env.get('SMTP_USER'),
          pass: env.get('SMTP_PASS'),
        },
      }
)

export default class MailService {
  static raw = transporter
  private static from = env.get('SMTP_FROM')

  private static async send(subject: string, to: string, html: string) {
    const sent = await this.raw.sendMail({
      from: this.from,
      to,
      subject,
      html,
    })

    if (env.get('NODE_ENV') === 'development') {
      console.log(JSON.parse((sent as any).message))
    }
  }

  static SendNewUserPassword(to: string, username: string, password: string) {
    this.send(
      to,
      'HarbourOS account created',
      `
        <h1>Welcome to HarbourOS</h1>
        <p>Your username and password are below.</p>
        <p>${username}</p>
        <p>${password}</p>
      `
    )
  }
}
