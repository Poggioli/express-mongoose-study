import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import GroupItemsBuilder from '../../testsUtils/groupItem'
import { GroupItem } from '../../../src/domain/models'
import { GroupItemsRepository } from '../../../src/domain/repositories'

describe('GroupItemsRepository', () => {
  let repository: GroupItemsRepository

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
  })

  beforeEach(() => {
    repository = new GroupItemsRepository()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  describe('insert', () => {
    it(`Should return an ObjectId
        When call insert
        With the right values`, async () => {
      const groupItem: GroupItem = new GroupItemsBuilder().build()
      const result = await repository.insert(groupItem)
      expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
    })

    describe('Validation Errors', () => {
      it(`Should return an Error
          When call insert
          Without name`, async () => {
        const groupItem: GroupItem = new GroupItemsBuilder().name(undefined).build()
        await expect(repository.insert(groupItem)).rejects.toThrow('ValidationError: name: Path `name` is required.')
      })

      it(`Should return an Error
          When call insert
          With name small than 3 characteres`, async () => {
        const groupItem: GroupItem = new GroupItemsBuilder().name('na').build()
        await expect(repository.insert(groupItem)).rejects
          .toThrow('ValidationError: name: Path `name` (`na`) is shorter than the minimum allowed length (3).')
      })

      it(`Should return an Error
          When call insert
          Without description`, async () => {
        const groupItem: GroupItem = new GroupItemsBuilder().description(undefined).build()
        await expect(repository.insert(groupItem)).rejects.toThrow('ValidationError: description: Path `description` is required.')
      })

      it(`Should return an Error
          When call insert
          Without items`, async () => {
        const groupItem: GroupItem = new GroupItemsBuilder().items(undefined).build()
        // eslint-disable-next-line max-len
        await expect(repository.insert(groupItem)).rejects.toThrow('ValidationError: items: items is shorter than the minimum allowed length (1).')
      })

      it(`Should return an Error
          When call insert
          With empty array of items`, async () => {
        const groupItem: GroupItem = new GroupItemsBuilder().items([]).build()
        await expect(repository.insert(groupItem)).rejects
          .toThrow('ValidationError: items: items is shorter than the minimum allowed length (1).')
      })
    })
  })
})
