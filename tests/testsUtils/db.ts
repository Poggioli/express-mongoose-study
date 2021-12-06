/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { UserModel, RoleModel, Role } from '../../src/domain/models'
import { CodeRoles } from '../../src/domain/models/rolesModel'
import RoleBuilder from './role'

class MongoD {
  private _mongod: any

  public get mongod(): MongoMemoryServer {
    return this._mongod
  }

  public async createDB(): Promise<void> {
    this._mongod = await MongoMemoryServer.create()
  }

  public async connect(): Promise<void> {
    const uri = this._mongod.getUri()
    await mongoose.connect(uri)
    await this.createDefaultUser()
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await this._mongod.stop()
  }

  public async clear(): Promise<void> {
    const colletions = mongoose.connection.collections
    for (const key of Object.keys(colletions)) {
      const colletion = colletions[key]
      await colletion.deleteMany({})
    }
    await this.createDefaultUser()
  }

  public async createDefaultUser(): Promise<void> {
    const roles: mongoose.Types.ObjectId[] = await this.createRoles()
    const document = new UserModel({
      name: 'JWT name', email: 'jwt@email.com', password: 'jwtPassowrd', roles: [...roles]
    })
    await document.save().then()
  }

  public async createRoles(): Promise<mongoose.Types.ObjectId[]> {
    const ids: mongoose.Types.ObjectId[] = []
    const sysAdm = new RoleModel(new RoleBuilder()
      .name('SYSADM')
      .description('System Admistator')
      .code(CodeRoles.SYSADM)
      .access(30)
      .build())
    const adm = new RoleModel(new RoleBuilder()
      .name('ADM')
      .description('Admistator')
      .code(CodeRoles.ADM)
      .access(20)
      .build())
    const sysUser = new RoleModel(new RoleBuilder()
      .name('SYSUSER')
      .description('System User with account')
      .code(CodeRoles.SYSUSER)
      .access(10)
      .build())
    const user = new RoleModel(new RoleBuilder()
      .name('USER')
      .description('Common User without account')
      .code(CodeRoles.USER)
      .access(0)
      .build())
    return sysAdm
      .save()
      .then((r: Role) => ids.push(r._id))
      .then(() => adm.save())
      .then((r: Role) => ids.push(r._id))
      .then(() => sysUser.save())
      .then((r: Role) => ids.push(r._id))
      .then(() => user.save())
      .then((r: Role) => ids.push(r._id))
      .then(() => ids)
  }
}

const db = new MongoD()
export default db
