import { GroupItemsService } from '@services'
import { jwtValidator, roleValidator } from '@src/core/auth'
import { GroupItemModel } from '@models'
import { Router } from 'express'
import { CodeRoles } from '@src/domain/models/rolesModel'
import Controller from './controller'

export default class GroupItemsController extends Controller {
  constructor(router: Router) {
    super(router, new GroupItemsService(), GroupItemModel)
  }

  protected insertHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.SYSADM, CodeRoles.ADM)
    ]
  }

  protected updateHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.SYSADM, CodeRoles.ADM)
    ]
  }

  protected deleteHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.SYSADM, CodeRoles.ADM)
    ]
  }
}
