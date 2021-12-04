import { NotFoundError } from '@src/core/customErrors'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export default function handleDisableEndpoint(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, resp: Response, next: NextFunction): Promise<void> => {
    const { message } = new NotFoundError(`Cannot ${(req.method as string).toUpperCase()} - ${req.url}`)
    resp.status(StatusCodes.NOT_FOUND).json(message)
    next(false)
  }
}
