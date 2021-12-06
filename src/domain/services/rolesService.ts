import { RolesRepository } from '@repositories'
import { Role } from '@models'
import Service from './service'

export default class RolesService extends Service<Role, RolesRepository> {
  constructor() {
    super(new RolesRepository())
  }

  protected mapperRequest(value: any): Partial<Role> {
    return ({
      name: value.name,
      description: value.description,
      code: value.code,
      access: value.access
    })
  }
}
