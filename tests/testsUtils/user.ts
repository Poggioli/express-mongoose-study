import mongoose from 'mongoose'
import { User } from '../../src/domain/models'

export default class UserBuilder {
  private _name: string | undefined

  private _email: string | undefined

  private _password: string | undefined

  private _active: boolean | undefined

  private _roles: mongoose.Types.ObjectId[] | undefined

  constructor() {
    this._name = 'name'
    this._email = 'email@test.com'
    this._password = 'password'
    this._active = true
    const roleId = new mongoose.Types.ObjectId()
    this._roles = [roleId]
  }

  public name(name: string | undefined): UserBuilder {
    this._name = name
    return this
  }

  public email(email: string | undefined): UserBuilder {
    this._email = email
    return this
  }

  public password(password: string | undefined): UserBuilder {
    this._password = password
    return this
  }

  public active(active: boolean | undefined): UserBuilder {
    this._active = active
    return this
  }

  public roles(roles: mongoose.Types.ObjectId[] | undefined): UserBuilder {
    this._roles = roles
    return this
  }

  public build(): User {
    return {
      name: this._name,
      email: this._email,
      password: this._password,
      active: this._active,
      roles: this._roles
    } as User
  }
}
