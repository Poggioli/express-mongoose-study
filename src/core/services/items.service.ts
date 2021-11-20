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

  public async findAll(req: Request, resp: Response): Promise<void | Response> {
    return this.repository.findAll()
      .then((items: Item[]) => resp.status(200).json(items))
      .catch((err) => { resp.status(500).json(err.message) })
  }

  public async findById(req: Request, resp: Response, next: NextFunction): Promise<void | Response> {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      resp.status(422).json('Id format is not valid')
      return next()
    }
    const finalId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
    return this.repository.findById(finalId)
      .then((item: Item | null) => (item ? resp.status(200).json(item) : resp.status(404).json('Document not found')))
      .catch((err) => { resp.status(500).json(err.message) })
  }

  public async insert(req: Request, resp: Response, next: NextFunction): Promise<void | Response> {
    const value: Partial<Item> = this.mapperRequestToItemInterface(req.body)
    return this.repository.insert(value as Item)
      .then((_id: mongoose.Types.ObjectId) => resp.status(201).json(_id.toString()))
      .catch((err) => {
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
      })
  }

  private mapperRequestToItemInterface(value: any): Partial<Item> {
    return ({
      name: value.name,
      description: value.description,
      price: value.price
    })
  }
}
