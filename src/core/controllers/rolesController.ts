import { RolesService } from '@services'
import { jwtValidator } from '@src/core/auth'
import Controller from '@src/core/controllers/controller'
import { RoleModel } from '@src/core/models'
import { Router } from 'express'

export default class RolesController extends Controller {
  constructor(router: Router) {
    super(router, new RolesService(), RoleModel)
  }

  protected findAllHandlers(): any[] {
    return [jwtValidator()]
  }

  protected findByIdHandlers(): any[] {
    return [jwtValidator()]
  }

  protected insertHandlers(): any[] {
    return [jwtValidator()]
  }

  protected updateHandlers(): any[] {
    return [jwtValidator()]
  }

  protected deleteHandlers(): any[] {
    return [jwtValidator()]
  }
}
