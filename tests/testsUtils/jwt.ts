/* eslint-disable max-len */
import { Jwt } from '../../src/core/auth'

const jwtValid: string = 'jwtToken=Bearer%20'.concat(new Jwt().createJwt({ name: 'JWT name', email: 'jwt@email.com' }))
const jwtInValid: string = 'jwtToken=Bearer%20'.concat('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdGUgand0IiwiZW1haWwiOiJ0ZXN0ZUBlbWFpbC5jb20iLCJleHAiOjE2Mzg0MTIwMDN9.ebqAOVpD5irASR0bx4YTPGNf7mS1gP8EdSGQRSx6I_c')

export { jwtInValid, jwtValid }
