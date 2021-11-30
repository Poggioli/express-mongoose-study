import { NotFoundError, UnprocessableEntityError } from '@src/core/customErrors'
import handleError from '@src/core/handlers'
import { Repository } from '@src/core/repositories'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose, { Document } from 'mongoose'

export default abstract class Service<D extends Document, R extends Repository<D>> {
  protected _repository: R

  constructor(_repository: R) {
    this._repository = _repository
  }

  public findAll(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const data: D[] = await this._repository.findAll().then((items: D[]) => items).catch((err) => { throw err })
        resp.status(StatusCodes.OK).json(data)
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  public findById(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const id = this.getId(req)
        const data: D | null = await this._repository.findById(id).then().catch((err) => { throw err })
        if (!data) {
          throw new NotFoundError()
        }
        resp.status(StatusCodes.OK).json(data)
      } catch (err: UnprocessableEntityError | NotFoundError | any) {
        handleError(resp, err)
      }
    }
  }

  public insert(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const value: Partial<D> = this.mapperRequest(req.body)
        const data: string = await this._repository.insert(value as D)
          .then((_id: mongoose.Types.ObjectId) => _id.toString())
        resp.status(StatusCodes.CREATED).json(data)
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  public update(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const id = this.getId(req)
        const value: Partial<D> = this.mapperRequest(req.body, true)
        const data: D | null = await this._repository.update(id, value as D).then().catch((err) => { throw err })
        if (!data) {
          throw new NotFoundError()
        }
        resp.status(StatusCodes.OK).json(data)
      } catch (err: UnprocessableEntityError | NotFoundError | any) {
        handleError(resp, err)
      }
    }
  }

  public delete(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const id = this.getId(req)
        await this._repository.delete(id).then().catch((err) => { throw err })
        resp.status(StatusCodes.NO_CONTENT).send()
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  private getId(req: Request): mongoose.Types.ObjectId {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityError('Id format is not valid')
    }
    return new mongoose.Types.ObjectId(id)
  }

  protected abstract mapperRequest(value: any, isUpdate?: boolean): Partial<D>
}
