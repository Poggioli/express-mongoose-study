import mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import db from '../../testsUtils/db'
import { UsersRepository } from '../../../src/core/repositories'
import { User, UserModel } from '../../../src/core/models'

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

  describe('insert', () => {
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

  describe('findByEmail', () => {
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

  describe('update', () => {
    it(`Should hashPassword
        When password change`, async () => {
      const user: Partial<User> = {
        name: 'name',
        password: 'password',
        email: 'test@email.com'
      }
      const id = await repository.insert(user as User)
      user.password = 'newPassword'
      const oldItem: User = await UserModel.findOne({ _id: id }, '+password') as User
      await repository.update(id, user as User) as User
      const newItem: User = await UserModel.findOne({ _id: id }, '+password') as User
      expect(bcrypt.compareSync('password', newItem.password)).toBe(false)
    })

    it(`Not should hashPassword 
        When password not change`, async () => {
      const user: Partial<User> = {
        name: 'name',
        password: 'password',
        email: 'test@email.com'
      }
      const id = await repository.insert(user as User)
      delete user.password
      user.name = 'name 12345'
      const oldItem: User = await UserModel.findOne({ _id: id }, '+password') as User
      await repository.update(id, user as User) as User
      const newItem: User = await UserModel.findOne({ _id: id }, '+password') as User
      expect(bcrypt.compareSync('password', newItem.password)).toBe(true)
    })
  })

  describe('authenticate', () => {
    it(`Should return true
        When find email and password match`, async () => {
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      await repository.insert(user as User)
      const result = await repository.authenticate(user as User)
      expect(result).toBeTruthy()
    })

    it(`Should return false
        When cannot find email`, async () => {
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      await repository.insert(user as User)
      const result = await repository.authenticate({ email: 'emaill@test.com', password: 'password' } as User)
      expect(result).toBeFalsy()
    })

    it(`Should return false
        When find email but password not match`, async () => {
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      await repository.insert(user as User)
      const result = await repository.authenticate({ email: 'email@test.com', password: 'passwordd' } as User)
      expect(result).toBeFalsy()
    })
  })
})
