import { UnprocessableEntityError } from '../../../src/core/customErrors'

describe('UnprocessableEntityError', () => {
  it(`Should return 422
      When call statusCode`, () => {
    const unprocessableEntityError: UnprocessableEntityError = new UnprocessableEntityError()
    expect(unprocessableEntityError.statusCode).toBe(422)
  })

  it(`If not set message
      Should return Unprocessable Entity
      When call message`, () => {
    const unprocessableEntityError: UnprocessableEntityError = new UnprocessableEntityError()
    expect(unprocessableEntityError.message).toBe('Unprocessable Entity')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const unprocessableEntityError: UnprocessableEntityError = new UnprocessableEntityError('message')
    expect(unprocessableEntityError.message).toBe('message')
  })
})
