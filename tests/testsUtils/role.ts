import { Role } from '../../src/core/models'
import { CodeRoles } from '../../src/core/models/rolesModel'

export default class RoleBuilder {
  private _name: string | undefined

  private _description: string | undefined

  private _code: CodeRoles | undefined

  private _access: number | undefined

  private _active: boolean

  constructor() {
    this._name = 'name'
    this._description = 'description'
    this._code = CodeRoles.SYSADM
    this._access = 0
    this._active = true
  }

  public name(name: string | undefined): RoleBuilder {
    this._name = name
    return this
  }

  public description(description: string | undefined): RoleBuilder {
    this._description = description
    return this
  }

  public code(code: string | undefined): RoleBuilder {
    this._code = code as CodeRoles
    return this
  }

  public access(access: number | undefined): RoleBuilder {
    this._access = access
    return this
  }

  public active(active: boolean): RoleBuilder {
    this._active = active
    return this
  }

  public build(): Role {
    return {
      name: this._name,
      description: this._description,
      code: this._code,
      access: this._access,
      active: this._active
    } as Role
  }
}
