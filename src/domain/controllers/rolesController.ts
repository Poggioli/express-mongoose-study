import { RolesService } from '@services'
import { jwtValidator, roleValidator } from '@src/core/auth'
import { RoleModel } from '@models'
import { Router } from 'express'
import { CodeRoles } from '@src/domain/models/rolesModel'
import Controller from './controller'

export default class RolesController extends Controller {
  constructor(router: Router) {
    super(router, new RolesService(), RoleModel)
  }

  protected findAllHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.ADM, CodeRoles.SYSADM)
    ]
  }

  protected findByIdHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.ADM, CodeRoles.SYSADM)
    ]
  }

  protected insertHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.SYSADM)
    ]
  }

  protected updateHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.SYSADM)
    ]
  }

  protected deleteHandlers(): any[] {
    return [
      jwtValidator(),
      roleValidator(CodeRoles.SYSADM)
    ]
  }
}
