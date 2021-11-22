import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import { UsersRepository } from '../../../src/core/repositories'

describe('UsersRepository', () => {
  let repository: UsersRepository

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
  })

  beforeEach(() => {
    repository = new UsersRepository()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  describe('Insert method', () => {
    it(`Should return an ObjectId
        When call insert
        With the right values`, async () => {
      const user: any = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      const result = await repository.insert(user)
      expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
    })

    describe('Validation Errors', () => {
      it(`Should return an Error
          When call insert
          Without name`, async () => {
        const user: any = {
          email: 'email@test.com',
          password: 'password'
        }
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: name: Path `name` is required.')
      })

      it(`Should return an Error
          When call insert
          With name small than 3 characteres`, async () => {
        const user: any = {
          name: 'na',
          email: 'email@test.com',
          password: 'password'
        }
        await expect(repository.insert(user)).rejects
          .toThrow('ValidationError: name: Path `name` (`na`) is shorter than the minimum allowed length (3).')
      })

      it(`Should return an Error
          When call insert
          Without email`, async () => {
        const user: any = {
          name: 'name',
          password: 'password'
        }
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: email: Path `email` is required.')
      })

      it(`Should return an Error
          When call insert
          With invalid email`, async () => {
        const user: any = {
          name: 'name',
          email: 'emailtest.com',
          password: 'password'
        }
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: email: Path `email` is invalid (emailtest.com).')
      })

      it(`Should return an Error
          When call insert
          Without password`, async () => {
        const user: any = {
          name: 'name',
          email: 'email@test.com'
        }
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: password: Path `password` is required.')
      })

      it(`Should return an Error
          When call insert
          With the same email`, async () => {
        const user: any = {
          name: 'name',
          email: 'email@test.com',
          password: 'password'
        }
        const result = await repository.insert(user)
        expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
        await expect(repository.insert(user)).rejects
          // eslint-disable-next-line max-len
          .toThrow('MongoServerError: E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "email@test.com" }')
      })
    })
  })
})
