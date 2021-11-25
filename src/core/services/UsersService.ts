import { BadRequestError, NotFoundError } from '@src/core/customErrors'
import handleError from '@src/core/handlers'
import { User } from '@src/core/models'
import { UsersRepository } from '@src/core/repositories'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Service from './service'

export default class UsersService extends Service<User, UsersRepository> {
  constructor() {
    super(new UsersRepository())
  }

  public findByEmail(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const { email } = req.query
        if (!email) {
          throw new BadRequestError('Email is required')
        }
        const data: User | null = await this._repository.findByEmail(email as string).catch((err) => { throw err })
        if (!data) {
          throw new NotFoundError('Email not found')
        }
        resp.status(StatusCodes.NO_CONTENT).send()
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  protected mapperRequest(value: any, isUpdate?: boolean): Partial<User> {
    if (isUpdate) {
      return ({
        name: value.name,
        email: value.email
      })
    }
    return ({
      name: value.name,
      email: value.email,
      password: value.password
    })
  }
}
