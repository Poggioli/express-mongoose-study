import { Role, RoleModel } from '@models'
import Repository from './repository'

export default class RolesRepository extends Repository<Role> {
  constructor() {
    super(RoleModel)
  }
}
