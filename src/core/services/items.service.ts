import { ItemsRepository } from '@repositories'
import { Item } from '@src/core/models'
import Service from './service'

export default class ItemsService extends Service<Item, ItemsRepository> {
  constructor() {
    super(new ItemsRepository())
  }

  protected mapperRequest(value: any): Partial<Item> {
    return ({
      name: value.name,
      description: value.description,
      price: value.price
    })
  }
}
