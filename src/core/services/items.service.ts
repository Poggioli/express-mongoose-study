import ItemsRepository from '@repositories'
import { Item } from '@models'

export default class ItemsService {
  private repository: ItemsRepository

  constructor() {
    this.repository = new ItemsRepository()
  }

  public findAll = async (): Promise<Item[]> => this.repository.findAll()
}
