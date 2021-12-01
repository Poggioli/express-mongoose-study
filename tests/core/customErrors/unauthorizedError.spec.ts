import { UnauthorizedError } from '../../../src/core/customErrors'

describe('UnauthorizedError', () => {
  it(`Should return 401
      When call statusCode`, () => {
    const unauthorizedError: UnauthorizedError = new UnauthorizedError()
    expect(unauthorizedError.statusCode).toBe(401)
  })

  it(`If not set message
      Should return Unauthorized
      When call message`, () => {
    const unauthorizedError: UnauthorizedError = new UnauthorizedError()
    expect(unauthorizedError.message).toBe('Unauthorized')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const unauthorizedError: UnauthorizedError = new UnauthorizedError('message')
    expect(unauthorizedError.message).toBe('message')
  })
})
