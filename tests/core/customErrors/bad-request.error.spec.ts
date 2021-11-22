import { BadRequest } from '../../../src/core/customErrors'

describe('BadRequest', () => {
  it(`Should return 400
      When call statusCode`, () => {
    const badRequest: BadRequest = new BadRequest()
    expect(badRequest.statusCode).toBe(400)
  })

  it(`If not set message
      Should return Bad Request
      When call message`, () => {
    const badRequest: BadRequest = new BadRequest()
    expect(badRequest.message).toBe('Bad Request')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const badRequest: BadRequest = new BadRequest('message')
    expect(badRequest.message).toBe('message')
  })
})
