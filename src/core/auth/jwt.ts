import environment from '@src/environment'
import { createHmac } from 'crypto'

export interface JwtExpiration {
  exp: number
}

export default class Jwt {
  public validate(jwtToken: string): boolean {
    const payload: JwtExpiration = this.parsePayload<JwtExpiration>(jwtToken)
    const signature = this.getSignature(jwtToken)
    const jwt = this.getJwtWithoutSignature(jwtToken)
    const realSignature = createHmac(
      'sha256',
      Buffer.from((environment.auth.jwtSecret as string), 'base64')
    )
      .update(jwt)
      .digest()
      .toString('base64')
    const realSignatureUrl = realSignature
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    return signature === realSignatureUrl && this.validateExpiration(payload)
  }

  public createJwt(payload: any): string {
    function toBase64Url(content: string) {
      return content
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    }

    const header = '{"typ":"JWT","alg":"HS256"}'
    const headerBase64 = Buffer.from(header).toString('base64')
    const headerBase64Url = toBase64Url(headerBase64)

    // eslint-disable-next-line no-param-reassign
    payload.exp = this.getExpirationTime()
    const payloadString = JSON.stringify(payload)
    const payloadBase64 = Buffer.from(payloadString).toString('base64')
    const payloadBase64Url = toBase64Url(payloadBase64)

    const content = headerBase64Url.concat('.', payloadBase64Url)
    const signature = createHmac('sha256', Buffer.from((environment.auth.jwtSecret as string), 'base64'))
      .update(content)
      .digest()
      .toString('base64')
    const signatureUrl = toBase64Url(signature)

    return content.concat('.', signatureUrl)
  }

  public getPayload<T>(jwtToken: string): T {
    return this.parsePayload<T>(jwtToken)
  }

  private parsePayload<T>(jwtToken: string): T {
    const payloadBase64Url = jwtToken.split('.')[1]
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString()
    return JSON.parse(payloadJson)
  }

  private getExpirationTime(): number {
    return Math.round(Date.now() / 1000) + Math.round(1440 * 60)
  }

  private getSignature(jwtToken: string): string {
    return jwtToken.split('.')[2]
  }

  private getJwtWithoutSignature(jwtToken: string): string {
    return jwtToken.substring(0, jwtToken.lastIndexOf('.'))
  }

  private validateExpiration(payload: JwtExpiration) {
    return Date.now() < payload.exp * 1000
  }
}
