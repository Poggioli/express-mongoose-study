import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../../../src/core/customErrors'

describe('NotFoundError', () => {
  it(`Should return 404
      When call statusCode`, () => {
    const notFoundError: NotFoundError = new NotFoundError()
    expect(notFoundError.statusCode).toBe(StatusCodes.NOT_FOUND)
  })

  it(`If not set message
      Should return Document Not Found
      When call message`, () => {
    const notFoundError: NotFoundError = new NotFoundError()
    expect(notFoundError.message).toBe('Document Not Found')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const notFoundError: NotFoundError = new NotFoundError('message')
    expect(notFoundError.message).toBe('message')
  })
})
