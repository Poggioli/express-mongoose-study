import { Jwt } from '@src/core/auth'
import ForbiddenError from '@src/core/customErrors/forbiddenError'
import { handleError } from '@handlers'
import { User } from '@models'
import { UsersRepository } from '@repositories'
import environment from '@src/environment'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { NotFoundError } from '@src/core/customErrors'
import Service from './service'

export default class UsersService extends Service<User, UsersRepository> {
  constructor() {
    super(new UsersRepository())
  }

  public verifyIfCanUpdate(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, resp: Response, next: NextFunction): Promise<void> => {
      try {
        const { user } = (req as any)
        const { id } = req.params
        const findUseById: User | null = await this._repository.findById(new mongoose.Types.ObjectId(id))
        if (!findUseById) {
          throw new NotFoundError('The user you try to to update don\'t exists')
        }
        if (user.email !== findUseById.email) {
          throw new ForbiddenError('You cannot update a user other than you')
        }
        next()
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  public authenticate(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const value: User = this.mapperRequest(req.body) as User
        let user: User | null = await this._repository.authenticate(value)
        if (!user) {
          throw new ForbiddenError()
        }
        user = this.mapperRequest(user, true) as User
        const jwt: string = new Jwt().createJwt(user)
        resp.status(StatusCodes.NO_CONTENT)
          .cookie(
            'jwtToken',
            'Bearer '.concat(jwt),
            {
              path: '/',
              secure: environment.isProduction,
              httpOnly: true
            }
          ).send()
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  protected mapperRequest(value: any, isUpdate?: boolean): Partial<User> {
    if (isUpdate) {
      return ({
        name: value.name,
        email: value.email,
        roles: value.roles
      })
    }
    return ({
      name: value.name,
      email: value.email,
      password: value.password,
      roles: value.roles
    })
  }
}
