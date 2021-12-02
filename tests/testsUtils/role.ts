import { Role } from '../../src/core/models'
import { CodeRoles } from '../../src/core/models/rolesModel'

export default class RoleBuilder {
  private _name: string

  private _description: string

  private _code: CodeRoles

  private _access: number

  private _active: boolean

  constructor() {
    this._name = 'name'
    this._description = 'description'
    this._code = CodeRoles.SYSADM
    this._access = 0
    this._active = true
  }

  public name(name: string): RoleBuilder {
    this._name = name
    return this
  }

  public description(description: string): RoleBuilder {
    this._description = description
    return this
  }

  public code(code: string): RoleBuilder {
    this._code = code as CodeRoles
    return this
  }

  public access(access: number): RoleBuilder {
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
