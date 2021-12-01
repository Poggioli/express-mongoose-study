import { NextFunction, Request, Response } from 'express'
import { jwtValidator } from '../../../src/core/auth'
import { UnauthorizedError, ForbiddenError } from '../../../src/core/customErrors'

describe('jwtValidator', () => {
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
    spyJsonResponse = jest.spyOn(response, 'json')
    spyStatusResponse = jest.spyOn(response, 'status')
  })

  it(`Should return status code 401
      When the request does not have the cookie`, async () => {
    expect.assertions(4)
    const call = jwtValidator()
    request = {
      headers: {}
    }
    await call(request as Request, response as Response, next)
    expect(spyStatusResponse).toHaveBeenCalledTimes(1)
    expect(spyStatusResponse).toHaveBeenCalledWith(401)
    expect(spyJsonResponse).toHaveBeenCalledTimes(1)
    expect(spyJsonResponse).toHaveBeenCalledWith(new UnauthorizedError())
  })

  it(`Should return status code 401
      When request have cookies
      But does not have jwtToke cookie`, async () => {
    expect.assertions(4)
    const call = jwtValidator()
    request = {
      headers: {
        cookie: 'test=testCookie'
      }
    }
    await call(request as Request, response as Response, next)
    expect(spyStatusResponse).toHaveBeenCalledTimes(1)
    expect(spyStatusResponse).toHaveBeenCalledWith(401)
    expect(spyJsonResponse).toHaveBeenCalledTimes(1)
    expect(spyJsonResponse).toHaveBeenCalledWith(new UnauthorizedError())
  })

  it(`Should return status code 403
      When request have jwtToken but is invalid`, async () => {
    expect.assertions(4)
    const call = jwtValidator()
    request = {
      headers: {
        // eslint-disable-next-line max-len
        cookie: 'jwtToken=Bearer%20eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdGUgand0IiwiZW1haWwiOiJ0ZXN0ZUBlbWFpbC5jb20iLCJleHAiOjE2Mzg0MTIwMDN9.ebqAOVpD5irASR0bx4YTPGNf7mS1gP8EdSGQRSx6I_c'
      }
    }
    await call(request as Request, response as Response, next)
    expect(spyStatusResponse).toHaveBeenCalledTimes(1)
    expect(spyStatusResponse).toHaveBeenCalledWith(403)
    expect(spyJsonResponse).toHaveBeenCalledTimes(1)
    expect(spyJsonResponse).toHaveBeenCalledWith(new ForbiddenError())
  })

  it(`Should call next
      When request have a valid jwtToken cookie`, async () => {
    expect.assertions(2)
    const call = jwtValidator()
    request = {
      headers: {
        // eslint-disable-next-line max-len
        cookie: 'jwtToken=Bearer%20eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdGUgand0IiwiZW1haWwiOiJ0ZXN0ZUBlbWFpbC5jb20iLCJleHAiOjE2Mzg0MTIwMDN9.KB9KntKn9MM5G3u1BBmEUighkaAjShP2msggH_6O1qI'
      }
    }
    await call(request as Request, response as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect((request as any).user).toBeDefined()
  })
})
