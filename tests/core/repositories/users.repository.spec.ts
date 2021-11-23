import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import { UsersRepository } from '../../../src/core/repositories'
import { User } from '../../../src/core/models'

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
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      const result = await repository.insert(user as User)
      expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
    })

    describe('Validation Errors', () => {
      it(`Should return an Error
          When call insert
          Without name`, async () => {
        const user: Partial<User> = {
          email: 'email@test.com',
          password: 'password'
        }
        await expect(repository.insert(user as User)).rejects.toThrow('ValidationError: name: Path `name` is required.')
      })

      it(`Should return an Error
          When call insert
          With name small than 3 characteres`, async () => {
        const user: Partial<User> = {
          name: 'na',
          email: 'email@test.com',
          password: 'password'
        }
        await expect(repository.insert(user as User)).rejects
          .toThrow('ValidationError: name: Path `name` (`na`) is shorter than the minimum allowed length (3).')
      })

      it(`Should return an Error
          When call insert
          Without email`, async () => {
        const user: Partial<User> = {
          name: 'name',
          password: 'password'
        }
        await expect(repository.insert(user as User)).rejects.toThrow('ValidationError: email: Path `email` is required.')
      })

      it(`Should return an Error
          When call insert
          With invalid email`, async () => {
        const user: Partial<User> = {
          name: 'name',
          email: 'emailtest.com',
          password: 'password'
        }
        await expect(repository.insert(user as User)).rejects.toThrow('ValidationError: email: Path `email` is invalid (emailtest.com).')
      })

      it(`Should return an Error
          When call insert
          Without password`, async () => {
        const user: Partial<User> = {
          name: 'name',
          email: 'email@test.com'
        }
        await expect(repository.insert(user as User)).rejects.toThrow('ValidationError: password: Path `password` is required.')
      })

      it(`Should return an Error
          When call insert
          With the same email`, async () => {
        const user: Partial<User> = {
          name: 'name',
          email: 'email@test.com',
          password: 'password'
        }
        const result = await repository.insert(user as User)
        expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
        await expect(repository.insert(user as User)).rejects
          // eslint-disable-next-line max-len
          .toThrow('MongoServerError: E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "email@test.com" }')
      })
    })
  })

  describe('FindByEmail methor', () => {
    it(`Should return an User
        When call FindByEmail
        With a right email`, async () => {
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      await repository.insert(user as User)
      const result = await repository.findByEmail(user.email as string) as User
      expect(result).toBeDefined()
      expect(result.name).toBe('name')
      expect(result.email).toBe('email@test.com')
    })
  })

  describe('FindById method', () => {
    it(`Should return an User
        When call findById
        With name, active and email saved before`, async () => {
      const user: Partial<User> = {
        name: 'name',
        password: 'password',
        email: 'test@email.com'
      }
      const id = await repository.insert(user as User)
      const result: User = await repository.findById(id) as User
      expect(result.name).toBe('name')
      expect(result.password).toBeUndefined()
      expect(result.email).toBe('test@email.com')
      expect(result.active).toBe(true)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    // ToDo implements when delete is done
    xit(`Should return null
        When call findById
        With to a deleted User before`, async () => {
      const user: Partial<User> = {
        name: 'name',
        password: 'password',
        email: 'test@email.com'
      }
      const id = await repository.insert(user as User)
      expect(await repository.findById(id)).not.toBeNull()
      // await repository.delete(id)
      expect(await repository.findById(id)).toBeNull()
    })

    it(`Should return null
        When call findById
        With an invalid ObjectId`, async () => {
      const user: Partial<User> = {
        name: 'name',
        password: 'password',
        email: 'test@email.com'
      }
      await repository.insert(user as User)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const result: User | null = await repository.findById(id)
      expect(result).toBeNull()
    })
  })
})
