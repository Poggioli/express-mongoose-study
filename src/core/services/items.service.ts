/* eslint-disable no-console */
import { ItemsRepository } from '@repositories'
import { NotFound, UnprocessableEntity } from '@src/core/customErrors'
import handleError from '@src/core/handlers'
import { Item } from '@src/core/models'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

export default class ItemsService {
  private repository: ItemsRepository

  constructor() {
    this.repository = new ItemsRepository()
  }

  public findAll(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const data: Item[] = await this.repository.findAll().then((items: Item[]) => items).catch((err) => { throw err })
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
        const data: Item | null = await this.repository.findById(id).then().catch((err) => { throw err })
        if (!data) {
          throw new NotFound()
        }
        resp.status(StatusCodes.OK).json(data)
      } catch (err: UnprocessableEntity | NotFound | any) {
        handleError(resp, err)
      }
    }
  }

  public insert(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const value: Partial<Item> = this.mapperRequestToItemInterface(req.body)
        const data: string = await this.repository.insert(value as Item)
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
        const value: Partial<Item> = this.mapperRequestToItemInterface(req.body)
        const data: Item | null = await this.repository.update(id, value as Item).then().catch((err) => { throw err })
        if (!data) {
          throw new NotFound()
        }
        resp.status(StatusCodes.OK).json(data)
      } catch (err: UnprocessableEntity | NotFound | any) {
        handleError(resp, err)
      }
    }
  }

  public delete(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const id = this.getId(req)
        await this.repository.delete(id).then().catch((err) => { throw err })
        resp.status(StatusCodes.NO_CONTENT).send()
      } catch (err: any) {
        handleError(resp, err)
      }
    }
  }

  private getId(req: Request): mongoose.Types.ObjectId {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntity('Id format is not valid')
    }
    return new mongoose.Types.ObjectId(id)
  }

  private mapperRequestToItemInterface(value: any): Partial<Item> {
    return ({
      name: value.name,
      description: value.description,
      price: value.price
    })
  }
}
