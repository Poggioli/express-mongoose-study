import { UserModel } from '@models'
import { UsersService } from '@services'
import { jwtValidator } from '@src/core/auth'
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

  protected updateHandlers(): any[] {
    return [
      jwtValidator(),
      (this._service as UsersService).verifyIfCanUpdate()
    ]
  }

  private authenticate(): void {
    this._router.post(
      this._url.concat('/authenticate'),
      [(this._service as UsersService).authenticate()]
    )
  }
}
