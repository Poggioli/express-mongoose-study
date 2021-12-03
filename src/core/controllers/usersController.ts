import { UserModel } from '@src/core/models'
import { UsersService } from '@src/core/services'
import { Router } from 'express'
import Controller from './controller'

export default class UsersController extends Controller {
  constructor(router: Router) {
    super(router, new UsersService(), UserModel)
    this.findByEmail()
    this.authenticate()
  }

  private findByEmail(): void {
    this._router.get(
      this._url.concat('/email'),
      [(this._service as UsersService).findByEmail()]
    )
  }

  private authenticate(): void {
    this._router.post(
      this._url.concat('/authenticate'),
      [(this._service as UsersService).authenticate()]
    )
  }
}
