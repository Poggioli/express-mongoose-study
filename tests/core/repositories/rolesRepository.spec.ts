import mongoose from 'mongoose'
import { Role } from '../../../src/core/models'
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
          const role = new RoleBuilder().name(undefined).build()
          await expect(repository.insert(role).then())
            .rejects
            .toThrow('ValidationError: name: Path `name` is required.')
        })
      })

      describe('Description', () => {
        it(`Should throw an error
            When description is not present`, async () => {
          expect.assertions(1)
          const role = new RoleBuilder().description(undefined).build()
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
          const role = new RoleBuilder().code(undefined).build()
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
          const role = new RoleBuilder().access(undefined).build()
          await expect(repository.insert(role).then())
            .rejects
            .toThrow('ValidationError: access: Path `access` is required.')
        })
      })
    })
  })
})
