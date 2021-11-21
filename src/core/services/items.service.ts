/* eslint-disable no-console */
import ItemsRepository from '@repositories'
import { Item } from '@src/core/models'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

export default class ItemsService {
  private repository: ItemsRepository

  constructor() {
    this.repository = new ItemsRepository()
  }

  public findAll(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const data: Item[] = await this.repository.findAll()
          .then((items: Item[]) => items)
          .catch((err) => { throw err })
        resp.status(200).json(data)
      } catch (err: any) {
        resp.status(500).json(err.message)
      }
    }
  }

  public findById(): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
    // eslint-disable-next-line consistent-return
    return async (req: Request, resp: Response, next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
          resp.status(422).json('Id format is not valid')
          return next()
        }
        const finalId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
        const data: Item | null = await this.repository.findById(finalId)
          .then()
          .catch((err) => { throw err })
        resp.status(data ? 200 : 404).json(data || 'Document not found')
      } catch (err: any) {
        resp.status(500).json(err.message)
      }
    }
  }

  public insert(): (req: Request, resp: Response) => Promise<void> {
    return async (req: Request, resp: Response): Promise<void> => {
      try {
        const value: Partial<Item> = this.mapperRequestToItemInterface(req.body)
        const data: string = await this.repository.insert(value as Item)
          .then((_id: mongoose.Types.ObjectId) => _id.toString())
        resp.status(201).json(data)
      } catch (err: any) {
        let statusCode!: number
        let messages: any
        if (err.name === 'ValidationError') {
          messages = []
          Object.keys(err.errors).forEach((key) => {
            messages.push(err.errors[key].message)
          })
          statusCode = 422
        }
        resp.status(statusCode || 500).json(messages || err.message)
      }
    }
  }

  private mapperRequestToItemInterface(value: any): Partial<Item> {
    return ({
      name: value.name,
      description: value.description,
      price: value.price
    })
  }
}
