import ItemsRepository from '@repositories'
import { Item } from '@src/core/models'
import { Request, Response } from 'express'

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
}
