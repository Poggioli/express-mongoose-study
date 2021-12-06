import { StatusCodes } from 'http-status-codes'
import { ForbiddenError } from '../../../src/core/customErrors'

describe('ForbiddenError', () => {
  it(`Should return 403
      When call statusCode`, () => {
    const forbiddenError: ForbiddenError = new ForbiddenError()
    expect(forbiddenError.statusCode).toBe(StatusCodes.FORBIDDEN)
  })

  it(`If not set message
      Should return Forbidden
      When call message`, () => {
    const forbiddenError: ForbiddenError = new ForbiddenError()
    expect(forbiddenError.message).toBe('Forbidden')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const forbiddenError: ForbiddenError = new ForbiddenError('message')
    expect(forbiddenError.message).toBe('message')
  })
})
