import mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import db from '../../testsUtils/db'
import { UsersRepository } from '../../../src/core/repositories'
import { User, UserModel } from '../../../src/core/models'
import UserBuilder from '../../testsUtils/user'

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
      const user: User = new UserBuilder().build()
      const result = await repository.insert(user)
      expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
    })

    describe('Validation Errors', () => {
      it(`Should return an Error
          When call insert
          Without name`, async () => {
        const user: User = new UserBuilder().name(undefined).build()
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: name: Path `name` is required.')
      })

      it(`Should return an Error
          When call insert
          With name small than 3 characteres`, async () => {
        const user: User = new UserBuilder().name('na').build()
        await expect(repository.insert(user)).rejects
          .toThrow('ValidationError: name: Path `name` (`na`) is shorter than the minimum allowed length (3).')
      })

      it(`Should return an Error
          When call insert
          Without email`, async () => {
        const user: User = new UserBuilder().email(undefined).build()
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: email: Path `email` is required.')
      })

      it(`Should return an Error
          When call insert
          With invalid email`, async () => {
        const user: User = new UserBuilder().email('emailtest.com').build()
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: email: Path `email` is invalid (emailtest.com).')
      })

      it(`Should return an Error
          When call insert
          Without password`, async () => {
        const user: User = new UserBuilder().password(undefined).build()
        await expect(repository.insert(user)).rejects.toThrow('ValidationError: password: Path `password` is required.')
      })

      it(`Should return an Error
          When call insert
          With the same email`, async () => {
        const user: User = new UserBuilder().build()
        const result = await repository.insert(user)
        expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
        await expect(repository.insert(user)).rejects
          // eslint-disable-next-line max-len
          .toThrow('MongoServerError: E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "email@test.com" }')
      })
    })
  })

  describe('update', () => {
    it(`Should hashPassword
        When password change`, async () => {
      const user: User = new UserBuilder().build()
      const id = await repository.insert(user)
      user.password = 'newPassword'
      await repository.update(id, user) as User
      const newItem: User = await UserModel.findOne({ _id: id }, '+password') as User
      expect(bcrypt.compareSync('password', newItem.password)).toBe(false)
      expect(bcrypt.compareSync('newPassword', newItem.password)).toBe(true)
    })

    it(`Not should hashPassword 
        When password not change`, async () => {
      let user: User = new UserBuilder().build()
      const id = await repository.insert(user)
      user = new UserBuilder().name('name 12345').password(undefined).build()
      await repository.update(id, user) as User
      const newItem: User = await UserModel.findOne({ _id: id }, '+password') as User
      expect(bcrypt.compareSync('password', newItem.password)).toBe(true)
    })
  })

  describe('authenticate', () => {
    it(`Should return true
        When find email and password match`, async () => {
      const user: User = new UserBuilder().build()
      await repository.insert(user)
      const result = await repository.authenticate(user)
      expect(result).toBeTruthy()
    })

    it(`Should return false
        When cannot find email`, async () => {
      const user: User = new UserBuilder().build()
      const wrongUser: User = new UserBuilder().email('emaill@test.com').build()
      await repository.insert(user)
      const result = await repository.authenticate(wrongUser)
      expect(result).toBeFalsy()
    })

    it(`Should return false
        When find email but password not match`, async () => {
      const user: User = new UserBuilder().build()
      const wrongUser: User = new UserBuilder().password('passwordd').build()
      await repository.insert(user)
      const result = await repository.authenticate(wrongUser)
      expect(result).toBeFalsy()
    })
  })
})
