import { ForbiddenError } from '../../../src/core/customErrors'

describe('ForbiddenError', () => {
  it(`Should return 403
      When call statusCode`, () => {
    const forbiddenError: ForbiddenError = new ForbiddenError()
    expect(forbiddenError.statusCode).toBe(403)
  })

  it(`If not set message
      Should return Document Forbidden
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
