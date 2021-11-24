import { Item, ItemModel } from '@models'
import Repository from './repository'

export default class ItemsRepository extends Repository<Item> {
  constructor() {
    super(ItemModel)
  }
}
