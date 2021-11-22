import { UnprocessableEntity } from '../../../src/core/customErrors'

describe('UnprocessableEntity', () => {
  it(`Should return 422
      When call statusCode`, () => {
    const unprocessableEntity: UnprocessableEntity = new UnprocessableEntity()
    expect(unprocessableEntity.statusCode).toBe(422)
  })

  it(`If not set message
      Should return Unprocessable Entity
      When call message`, () => {
    const unprocessableEntity: UnprocessableEntity = new UnprocessableEntity()
    expect(unprocessableEntity.message).toBe('Unprocessable Entity')
  })

  it(`If set message
      Should return the message setted
      When call message`, () => {
    const unprocessableEntity: UnprocessableEntity = new UnprocessableEntity('message')
    expect(unprocessableEntity.message).toBe('message')
  })
})
