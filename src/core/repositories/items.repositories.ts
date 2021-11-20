import { Item, ItemInterface } from '@models'
import { Model } from 'mongoose'

export default class ItemsRepository {
  private model: Model<ItemInterface>

  constructor() {
    this.model = Item
  }

  public findAll = (): Promise<ItemInterface[]> => this.model.find().then()
}
