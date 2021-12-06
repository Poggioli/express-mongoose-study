import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { handleDisableEndpoint } from '../../../src/core/handlers'

describe('handleDisableEndpoint', () => {
  let request: Partial<Request>
  let response: Partial<Response>
  let spyStatusResponse: jest.SpyInstance
  let spyJsonResponse: jest.SpyInstance
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    response = {
      status: () => response as Response,
      json: jest.fn()
    }
    request = {
      method: 'GET',
      url: '/teste'
    }
    spyJsonResponse = jest.spyOn(response, 'json')
    spyStatusResponse = jest.spyOn(response, 'status')
  })

  it('Should return status 404', async () => {
    expect.assertions(2)
    const call = handleDisableEndpoint()
    await call(request as Request, response as Response, next)
    expect(spyStatusResponse).toHaveBeenCalledTimes(1)
    expect(spyStatusResponse).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
  })

  it('Should return message \'Cannot GET - /teste\'', async () => {
    expect.assertions(2)
    const call = handleDisableEndpoint()
    await call(request as Request, response as Response, next)
    expect(spyJsonResponse).toHaveBeenCalledTimes(1)
    expect(spyJsonResponse).toHaveBeenCalledWith('Cannot GET - /teste')
  })

  it('Should call next with \'route\' value', async () => {
    expect.assertions(2)
    const call = handleDisableEndpoint()
    await call(request as Request, response as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith('route')
  })
})
