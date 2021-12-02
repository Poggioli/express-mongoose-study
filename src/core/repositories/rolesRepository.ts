import { Role, RoleModel } from '@models'
import Repository from './repository'

export default class rolesRepository extends Repository<Role> {
  constructor() {
    super(RoleModel)
  }
}
