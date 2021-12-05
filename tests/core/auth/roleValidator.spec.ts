import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { roleValidator } from '../../../src/core/auth'
import { ForbiddenError } from '../../../src/core/customErrors'
import db from '../../testsUtils/db'

describe('roleValidator', () => {
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

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
    await db.createRoles()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => {
    await db.disconnect()
  })

  it(`Should return statusCode 403
      When user don't have any role needed
      And the role he has is smaller than needed`, async () => {
    expect.assertions(5);
    (request as any) = {
      user: {
        roles: [
          { code: 'U1lTVVNFUg==', access: 10 },
          { code: 'VVNFUg==', access: 0 }
        ]
      }
    }
    const call = roleValidator('U1lTQURN', 'QURN')
    await call(request as Request, response as Response, next)
    expect(spyStatusResponse).toHaveBeenCalledTimes(1)
    expect(spyStatusResponse).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
    expect(spyJsonResponse).toHaveBeenCalledTimes(1)
    expect(spyJsonResponse).toHaveBeenCalledWith(new ForbiddenError().message)
    expect(next).not.toHaveBeenCalled()
  })

  it(`Should call next
      When user has the role needed
      And the role he has is smaller than needed`, async () => {
    expect.assertions(3);
    (request as any) = {
      user: {
        roles: [
          { code: 'U1lTVVNFUg==', access: 10 },
          { code: 'VVNFUg==', access: 0 }
        ]
      }
    }
    const call = roleValidator('U1lTQURN', 'QURN', 'VVNFUg==')
    await call(request as Request, response as Response, next)
    expect(spyStatusResponse).not.toHaveBeenCalled()
    expect(spyJsonResponse).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it(`Should call next
      When user don't have any role needed
      And the role he has is bigger than needed`, async () => {
    expect.assertions(3);
    (request as any) = {
      user: {
        roles: [
          { code: 'U1lTQURN', access: 30 }
        ]
      }
    }
    const call = roleValidator('VVNFUg==')
    await call(request as Request, response as Response, next)
    expect(spyStatusResponse).not.toHaveBeenCalled()
    expect(spyJsonResponse).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })
})
