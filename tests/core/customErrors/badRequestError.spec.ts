import { BadRequestError } from '../../../src/core/customErrors'

describe('BadRequestError', () => {
  it(`Should return 400
      When call statusCode`, () => {
    const badRequestError: BadRequestError = new BadRequestError()
    expect(badRequestError.statusCode).toBe(400)
  })

  it(`If not set message
      Should return Bad Request
      When call message`, () => {
    const badRequestError: BadRequestError = new BadRequestError()
    expect(badRequestError.message).toBe('Bad Request')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const badRequestError: BadRequestError = new BadRequestError('message')
    expect(badRequestError.message).toBe('message')
  })
})
