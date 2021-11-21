import ItemsService from '@services'
import { ItemModel } from '@src/core/models'
import { Router } from 'express'

export default class ItemsController {
  public static create(router: Router): void {
    const service: ItemsService = new ItemsService()
    this.findAll(router, service)
    this.insert(router, service)
  }

  private static findAll(router: Router, service: ItemsService): void {
    const url: string = '/'.concat(ItemModel.collection.name)
    router.get(url, [service.findAll()])
  }

  private static insert(router: Router, service: ItemsService): void {
    const url: string = '/'.concat(ItemModel.collection.name)
    router.post(url, [service.insert()])
  }
}
