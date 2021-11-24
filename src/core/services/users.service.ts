import { BadRequest, NotFound, UnprocessableEntity } from '@src/core/customErrors'
import handleError from '@src/core/handlers'
import { User } from '@src/core/models'
import { UsersRepository } from '@src/core/repositories'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

export default class UsersService {
  private repository: UsersRepository

  constructor() {
    this.repository = new UsersRepository()
  }

  public insert(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const value: Partial<User> = this.mapperRequestToUserInterface(req.body)
        const data: string = await this.repository.insert(value as User)
          .then((_id: mongoose.Types.ObjectId) => _id.toString())
        resp.status(StatusCodes.CREATED).json(data)
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  public findByEmail(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const { email } = req.query
        if (!email) {
          throw new BadRequest('Email is required')
        }
        const data: User | null = await this.repository.findByEmail(email as string).catch((err) => { throw err })
        if (!data) {
          throw new NotFound('Email not found')
        }
        resp.status(StatusCodes.NO_CONTENT).send()
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  public findById(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const id = this.getId(req)
        const data: User | null = await this.repository.findById(id).then().catch((err) => { throw err })
        if (!data) {
          throw new NotFound()
        }
        resp.status(StatusCodes.OK).json(data)
      } catch (err: UnprocessableEntity | NotFound | any) {
        handleError(resp, err)
      }
    }
  }

  public update(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const id = this.getId(req)
        const value: Partial<User> = this.mapperRequestToUserInterface(req.body, true)
        const data: User | null = await this.repository.update(id, value as User).then().catch((err) => { throw err })
        if (!data) {
          throw new NotFound()
        }
        resp.status(StatusCodes.OK).json(data)
      } catch (err: UnprocessableEntity | NotFound | any) {
        handleError(resp, err)
      }
    }
  }

  private mapperRequestToUserInterface(value: any, isUpdate?: boolean): Partial<User> {
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

  private getId(req: Request): mongoose.Types.ObjectId {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntity('Id format is not valid')
    }
    return new mongoose.Types.ObjectId(id)
  }
}
