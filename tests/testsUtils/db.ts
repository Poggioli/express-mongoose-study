/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { UserModel } from '../../src/core/models'

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
  }

  public async createDefaultUser(): Promise<void> {
    const document = new UserModel({ name: 'JWT name', email: 'jwt@email.com', password: 'jwtPassowrd' })
    await document.save().then()
  }
}

const db = new MongoD()
export default db
