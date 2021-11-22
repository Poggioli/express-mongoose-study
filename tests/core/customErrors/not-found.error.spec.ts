import { NotFound } from '../../../src/core/customErrors'

describe('NotFound', () => {
  it(`Should return 404
      When call statusCode`, () => {
    const notFound: NotFound = new NotFound()
    expect(notFound.statusCode).toBe(404)
  })

  it(`If not set message
      Should return Document Not Found
      When call message`, () => {
    const notFound: NotFound = new NotFound()
    expect(notFound.message).toBe('Document Not Found')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const notFound: NotFound = new NotFound('message')
    expect(notFound.message).toBe('message')
  })
})
