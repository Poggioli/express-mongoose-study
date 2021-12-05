import { ForbiddenError, UnauthorizedError } from '@src/core/customErrors'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Jwt from './jwt'

function cookiesToObject(cookie: string): any {
  return decodeURIComponent(cookie).split('; ')
    .reduce((prev: any, current: string) => {
      const [name, ...value] = current.split('=')
      // eslint-disable-next-line no-param-reassign
      prev[name] = value.join('=')
      return prev
    }, {})
}

export default function jwtValidator(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, resp: Response, next: NextFunction): Promise<void> => {
    const { cookie } = req.headers
    const cookies: any = cookie ? cookiesToObject(cookie) : {}
    if (!Object.prototype.hasOwnProperty.call(cookies, 'jwtToken')) {
      resp.status(StatusCodes.UNAUTHORIZED).json(new UnauthorizedError().message)
      return
    }
    const jwt: Jwt = new Jwt()
    const jwtToken: string = cookies.jwtToken.substring('Bearer '.length)
    if (!jwt.validate(jwtToken)) {
      resp.status(StatusCodes.FORBIDDEN).json(new ForbiddenError().message)
      return
    }
    (req as any).user = jwt.getPayload(jwtToken)
    next()
  }
}
