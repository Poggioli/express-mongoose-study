import { UserModel } from '@src/core/models'
import { UsersService } from '@src/core/services'
import { Router } from 'express'

export default class UsersController {
  public static create(router: Router): void {
    const service: UsersService = new UsersService()
    this.insert(router, service)
    this.findByEmail(router, service)
    this.findById(router, service)
    this.delete(router, service)
    this.authenticate(router, service)
    this.update(router, service)
  }

  private static insert(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name)
    router.post(url, [service.insert()])
  }

  private static findByEmail(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name, '/email')
    router.get(url, [service.findByEmail()])
  }

  private static findById(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name, '/:id')
    router.get(url, [service.findById()])
  }

  private static delete(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name, '/:id')
    router.delete(url, [service.delete()])
  }

  private static authenticate(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name, '/authenticate')
    router.post(url, [service.authenticate()])
  }

  private static update(router: Router, service: UsersService): void {
    const url: string = '/'.concat(UserModel.collection.name, '/:id')
    router.put(url, [service.update()])
  }
}
