import { UserModel } from '@models'
import { UsersService } from '@services'
import { handleDisableEndpoint } from '@src/core/handlers'
import { Router } from 'express'
import Controller from './controller'

export default class UsersController extends Controller {
  constructor(router: Router) {
    super(router, new UsersService(), UserModel)
  }

  protected findAllHandlers(): any[] {
    return [handleDisableEndpoint()]
  }

  createCustomRouter(): void {
    this.authenticate()
  }

  private authenticate(): void {
    this._router.post(
      this._url.concat('/authenticate'),
      [(this._service as UsersService).authenticate()]
    )
  }
}
