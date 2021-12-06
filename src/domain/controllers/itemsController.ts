import { ItemsService } from '@services'
import { jwtValidator, roleValidator } from '@src/core/auth'
import { ItemModel } from '@models'
import { Router } from 'express'
import { CodeRoles } from '@src/domain/models/rolesModel'
import Controller from './controller'

export default class ItemsController extends Controller {
  constructor(router: Router) {
    super(router, new ItemsService(), ItemModel)
  }

  protected insertHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.ADM, CodeRoles.SYSADM)
    ]
  }

  protected deleteHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.ADM, CodeRoles.SYSADM)
    ]
  }

  protected updateHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.ADM, CodeRoles.SYSADM)
    ]
  }
}
