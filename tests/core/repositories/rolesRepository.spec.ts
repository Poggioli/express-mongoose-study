import mongoose from 'mongoose'
import { Role, RoleModel } from '../../../src/core/models'
import { RolesRepository } from '../../../src/core/repositories'
import db from '../../testsUtils/db'
import RoleBuilder from '../../testsUtils/role'

describe('RolesRepository', () => {
  let repository: RolesRepository

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
  })

  beforeEach(() => {
    repository = new RolesRepository()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  describe('findAll', () => {
    it('Should return an array of Roles', async () => {
      expect.assertions(1)
      const result = await repository.findAll()
      expect(result).toStrictEqual([])
    })

    it('Should return an array of only activated Roles', async () => {
      expect.assertions(2)
      const roleActive = new RoleModel(new RoleBuilder().name('roleActive').build())
      const roleDisable = new RoleModel(new RoleBuilder().name('roleDisable').active(false).build())
      await roleActive.save().then(() => roleDisable.save().then())

      const result = await repository.findAll()
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('roleActive')
    })
  })

  describe('findById', () => {
    it(`Should return a Role
        When id exists`, async () => {
      expect.assertions(1)
      const role = new RoleModel(new RoleBuilder().build())
      const id: mongoose.Types.ObjectId = await role.save().then((r) => (r as Role)._id)
      const result = await repository.findById(id)
      expect(result).toBeTruthy()
    })

    it(`Should return null
        When id doesn't exists`, async () => {
      expect.assertions(1)
      const result = await repository.findById(new mongoose.Types.ObjectId())
      expect(result).toBeNull()
    })

    it(`Should return null
        When id exists
        And the role is not activated`, async () => {
      expect.assertions(2)
      const role = new RoleModel(new RoleBuilder().active(false).build())
      const id: mongoose.Types.ObjectId = await role.save().then((r) => (r as Role)._id)
      const result = await repository.findById(id)
      expect(mongoose.Types.ObjectId.isValid(id)).toBe(true)
      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it(`Should return an id
        When is a valid object`, async () => {
      expect.assertions(1)
      const role = new RoleBuilder().build()
      const result: Role = await repository.insert(role).then()
      expect(mongoose.Types.ObjectId.isValid(result.id)).toBe(true)
    })

    describe('Validation Errors', () => {
      describe('Name', () => {
        it(`Should throw an error
            When name is not present`, async () => {
          expect.assertions(1)
          const role = new RoleBuilder().build()
          // @ts-ignore
          delete role.name
          await expect(repository.insert(role).then())
            .rejects
            .toThrow('ValidationError: name: Path `name` is required.')
        })
      })

      describe('Description', () => {
        it(`Should throw an error
            When description is not present`, async () => {
          expect.assertions(1)
          const role = new RoleBuilder().build()
          // @ts-ignore
          delete role.description
          await expect(repository.insert(role).then())
            .rejects
            .toThrow('ValidationError: description: Path `description` is required.')
        })

        it(`Should throw an error
            When description is grather than 300 characters`, async () => {
          expect.assertions(1)
          const description: string = Array(301).fill('a').join('')
          const role = new RoleBuilder().description(description).build()
          await expect(repository.insert(role).then())
            .rejects
            .toThrow(
              `ValidationError: description: Path \`description\` (\`${description}\`) is longer than the maximum allowed length (300).`
            )
        })
      })

      describe('Code', () => {
        it(`Should throw an error
            When code is not present`, async () => {
          expect.assertions(1)
          const role = new RoleBuilder().build()
          // @ts-ignore
          delete role.code
          await expect(repository.insert(role).then())
            .rejects
            .toThrow('ValidationError: code: Path `code` is required.')
        })

        it(`Should throw an error
            When code is not one of the Enum CodeRoles`, async () => {
          expect.assertions(1)
          const role = new RoleBuilder().code('teste').build()
          await expect(repository.insert(role).then())
            .rejects
            .toThrow('ValidationError: code: `teste` is not a valid enum value for path `code`.')
        })
      })

      describe('Access', () => {
        it(`Should throw an error
            When access is not present`, async () => {
          expect.assertions(1)
          const role = new RoleBuilder().build()
          // @ts-ignore
          delete role.access
          await expect(repository.insert(role).then())
            .rejects
            .toThrow('ValidationError: access: Path `access` is required.')
        })
      })
    })
  })

  describe('update', () => {
    it(`Should return a Role updated
        When update works`, async () => {
      expect.assertions(1)
      const role = new RoleModel(new RoleBuilder().build())
      const id: mongoose.Types.ObjectId = await role.save().then((r) => (r as Role)._id)
      role.name = 'Name updated'
      const result = await repository.update(id, role) as Role
      expect(result.name).toBe('Name updated')
    })

    it(`Should change updatedAt
        When update works`, async () => {
      expect.assertions(1)
      const role = new RoleModel(new RoleBuilder().build())
      const id: mongoose.Types.ObjectId = await role.save().then((r) => (r as Role)._id)
      const oldRole: Role = await RoleModel.findOne({ _id: id }).then() as Role
      role.name = 'Name updated'
      const result: Role = await repository.update(id, role).then() as Role
      // @ts-ignore
      expect(result.updatedAt > oldRole.updatedAt).toBe(true)
    })

    it(`Should return null
        When id doesn't exists`, async () => {
      expect.assertions(1)
      const role = new RoleModel(new RoleBuilder().build())
      await role.save().then()
      const result = await repository.update(new mongoose.Types.ObjectId(), role)
      expect(result).toBeNull()
    })

    it(`Should throw an error
        When description is grather than 300 characters`, async () => {
      expect.assertions(1)
      let role = new RoleModel(new RoleBuilder().build())
      const id: mongoose.Types.ObjectId = await role.save().then((r) => (r as Role)._id)
      const description: string = Array(301).fill('a').join('')
      role = new RoleModel(new RoleBuilder().description(description).build())
      await expect(repository.update(id, role).then())
        .rejects
        .toThrow(
          `ValidationError: description: Path \`description\` (\`${description}\`) is longer than the maximum allowed length (300).`
        )
    })
  })

  describe('delete', () => {
    it(`Should return a Role
        When delete works`, async () => {
      expect.assertions(2)
      const roleActive = new RoleModel(new RoleBuilder().build())
      const id: mongoose.Types.ObjectId = await roleActive.save().then((r: Role) => r._id)
      const result = await repository.delete(id).then()
      expect(result).toBeDefined()

      const findAll = await repository.findAll()
      expect(findAll.length).toBe(0)
    })

    it(`Should change updatedAt
        When delete works`, async () => {
      expect.assertions(1)
      const roleActive = new RoleModel(new RoleBuilder().build())
      const oldRole: Role = await roleActive.save().then()
      const result = await repository.delete(oldRole._id).then()
      // @ts-ignore
      expect(result.createdAt > oldRole.createdAt).toBeDefined()
    })

    it(`Should return null
        When id doesn't exists`, async () => {
      expect.assertions(2)
      const roleActive = new RoleModel(new RoleBuilder().build())
      await roleActive.save().then((r: Role) => r._id)
      const result = await repository.delete(new mongoose.Types.ObjectId()).then()
      expect(result).toBeNull()

      const findAll = await repository.findAll()
      expect(findAll.length).toBe(1)
    })
  })
})
