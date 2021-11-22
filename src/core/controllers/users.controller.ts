import { UserModel } from '@src/core/models'
import { UsersService } from '@src/core/services'
import { Router } from 'express'

export default class UsersController {
  public static create(router: Router): void {
    const service: UsersService = new UsersService()
    this.insert(router, service)
    this.findByEmail(router, service)
  }

  private static insert(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name)
    router.post(url, [service.insert()])
  }

  private static findByEmail(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name, '/email')
    router.get(url, [service.findByEmail()])
  }
}
