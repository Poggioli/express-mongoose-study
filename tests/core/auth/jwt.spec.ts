import { createHmac } from 'crypto'
import Jwt from '../../../src/core/auth'
import environment from '../../../src/environment'

describe('jwt', () => {
  function createInvalid(payload: any, secret: string = environment.auth.jwtSecret as string, expirationTime: number = 1450): string {
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
    payload.exp = Math.round(Date.now() / 1000) + Math.round(expirationTime * 60)
    const payloadString = JSON.stringify(payload)
    const payloadBase64 = Buffer.from(payloadString).toString('base64')
    const payloadBase64Url = toBase64Url(payloadBase64)

    const content = headerBase64Url.concat('.', payloadBase64Url)
    const signature = createHmac('sha256', Buffer.from(secret, 'base64'))
      .update(content)
      .digest()
      .toString('base64')
    const signatureUrl = toBase64Url(signature)

    return content.concat('.', signatureUrl)
  }

  describe('validate', () => {
    it('Should be valid when signature and expiration is valid', () => {
      const jwt: Jwt = new Jwt()
      const jwtToken: string = jwt.createJwt({ name: 'John Doe' })
      expect(jwt.validate(jwtToken)).toBe(true)
    })

    it('Should be invalid when signature is invalid and expiration is valid', () => {
      const jwt: Jwt = new Jwt()
      const jwtToken: string = createInvalid({ name: 'John Doe' }, 'abc')
      expect(jwt.validate(jwtToken)).toBe(false)
    })

    it('Should be invalid when signature is valid and expiration is invalid', () => {
      const jwt: Jwt = new Jwt()
      const jwtToken: string = createInvalid({ name: 'John Doe' }, environment.auth.jwtSecret, -1)
      expect(jwt.validate(jwtToken)).toBe(false)
    })

    it('Should be invalid when signature is invalid and expiration is invalid', () => {
      const jwt: Jwt = new Jwt()
      const jwtToken: string = createInvalid({ name: 'John Doe' }, 'abc', -1)
      expect(jwt.validate(jwtToken)).toBe(false)
    })
  })

  describe('createJwt', () => {
    it('Should create a JWT', () => {
      const jwt: Jwt = new Jwt()
      expect(jwt.createJwt({ name: 'John Doe' })).toBeTruthy()
      expect(jwt.createJwt({ name: 'John Doe' }).split('.').length).toBe(3)
    })
  })

  describe('getPayload', () => {
    it('Should retrieve the exact payload was sended to create jwt', () => {
      interface Payload {
        name: string
      }
      const jwt: Jwt = new Jwt()
      const payload: Payload = { name: 'nome123' }
      const jwtString: string = jwt.createJwt(payload)
      const payloadDecoded: Payload = jwt.getPayload<Payload>(jwtString)
      expect(payloadDecoded).toStrictEqual(payload)
    })
  })
})
