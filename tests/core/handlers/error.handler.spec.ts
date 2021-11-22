import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import handleError from '../../../src/core/handlers'
import { NotFound } from '../../../src/core/customErrors'

describe('handleError', () => {
  let resp: Partial<Response>
  let spyStatus: jest.SpyInstance
  let spyJson: jest.SpyInstance

  beforeEach(() => {
    resp = {
      status: () => resp as Response,
      json: jest.fn()
    }
    spyStatus = jest.spyOn(resp, 'status')
    spyJson = jest.spyOn(resp, 'json')
  })

  it(`When is ValidationError
      Then should return an 422 statusCode
      and an Array of error message`, () => {
    const err = {
      name: 'ValidationError',
      errors: {
        name: {
          message: 'Error message'
        }
      }
    }
    handleError(resp as Response, err)
    expect(spyStatus).toHaveBeenCalledTimes(1)
    expect(spyStatus).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY)
    expect(spyJson).toHaveBeenCalledTimes(1)
    expect(spyJson).toHaveBeenCalledWith(['Error message'])
  })

  it(`When is an instance of custom Error
      Then should return the right statusCode
      and the right message`, () => {
    const notFound: NotFound = new NotFound()
    handleError(resp as Response, notFound)
    expect(spyStatus).toHaveBeenCalledTimes(1)
    expect(spyStatus).toHaveBeenCalledWith(notFound.statusCode)
    expect(spyJson).toHaveBeenCalledTimes(1)
    expect(spyJson).toHaveBeenCalledWith(notFound.message)
  })

  it(`When is an unknown Error
      Then should return an 500 statusCode
      and the right message of error`, () => {
    const unknownError = { message: 'unknownError' }
    handleError(resp as Response, unknownError)
    expect(spyStatus).toHaveBeenCalledTimes(1)
    expect(spyStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(spyJson).toHaveBeenCalledTimes(1)
    expect(spyJson).toHaveBeenCalledWith(unknownError.message)
  })
})
