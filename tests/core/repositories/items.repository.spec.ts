import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import { ItemsRepository } from '../../../src/core/repositories'
import { Item } from '../../../src/core/models/items.model'

describe('ItemsRepository', () => {
  let repository: ItemsRepository

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
  })

  beforeEach(() => {
    repository = new ItemsRepository()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  describe('FindAll method', () => {
    it(`Should return an Item[]
        When call findAll`, async () => {
      const result = await repository.findAll()
      expect(result).toStrictEqual([])
    })
  })

  describe('Insert method', () => {
    it(`Should return an ObjectId
        When call insert
        With the right values`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const result = await repository.insert(item)
      expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
    })

    describe('Validation Errors', () => {
      it(`Should return an Error
          When call insert
          Without name`, async () => {
        const item: any = {
          price: 1,
          description: 'description'
        }
        await expect(repository.insert(item)).rejects.toThrow('ValidationError: name: Path `name` is required.')
      })

      it(`Should return an Error
          When call insert
          Without price`, async () => {
        const item: any = {
          name: 'name',
          description: 'description'
        }
        await expect(repository.insert(item)).rejects.toThrow('ValidationError: price: Path `price` is required.')
      })

      it(`Should return an Error
          When call insert
          With price lower than 1`, async () => {
        const item: any = {
          name: 'name',
          price: 0.5,
          description: 'description'
        }
        await expect(repository.insert(item)).rejects
          .toThrow('ValidationError: price: Path `price` (0.5) is less than minimum allowed value (1).')
      })

      it(`Should return an Error
          When call insert
          Without description`, async () => {
        const item: any = {
          name: 'name',
          price: 1
        }
        await expect(repository.insert(item)).rejects.toThrow('ValidationError: description: Path `description` is required.')
      })

      it(`Should return an Error
          When call insert
          With description bigger than 300 characters`, async () => {
        const description: string = Array(301).fill('a').join('')
        const item: any = {
          name: 'name',
          price: 1,
          description
        }
        await expect(repository.insert(item)).rejects
          // eslint-disable-next-line max-len
          .toThrow(`ValidationError: description: Path \`description\` (\`${description}\`) is longer than the maximum allowed length (300).`)
      })
    })
  })

  describe('FindById method', () => {
    it(`Should return an Item
        When call findById
        With description, name and price saved before`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id = await repository.insert(item)
      const result: Item = await repository.findById(id) as Item
      expect(result.description).toBe('description')
      expect(result.name).toBe('name')
      expect(result.price).toBe(1)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it(`Should return null
        When call findById
        With an invalid ObjectId`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      await repository.insert(item)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const result: Item | null = await repository.findById(id)
      expect(result).toBeNull()
    })
  })

  describe('Update method', () => {
    it(`Should return the Item
        When update works`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id = await repository.insert(item)
      item.name = 'name 12345'
      const oldItem: Item = await repository.findById(id) as Item
      const result: Item = await repository.update(id, item) as Item
      expect(result.name).toBe('name 12345')
      expect(result.price).toBe(1)
      expect(result.description).toBe('description')
      expect((result.updatedAt as Date).getTime() > (oldItem.updatedAt as Date).getTime()).toBe(true)
    })

    it(`Should return null
        When update not found a document to update`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      await repository.insert(item)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const result: Item | null = await repository.update(id, item)
      expect(result).toBeNull()
    })

    describe('Validation Errors', () => {
      it(`Should run the validations
        When update is called`, async () => {
        const item: any = {
          name: 'name',
          price: 1,
          description: 'description'
        }
        const id = await repository.insert(item)
        item.price = 0.5
        await expect(repository.update(id, item)).rejects
          .toThrow('ValidationError: price: Path `price` (0.5) is less than minimum allowed value (1).')
      })
    })
  })

  describe('Delete method', () => {
    it(`Should return the Item
        When delete works`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id = await repository.insert(item)
      const insertedItem: Item = await repository.findById(id) as Item
      expect(insertedItem.active).toBe(true)
      const deletedItem: Item = await repository.delete(id) as Item
      expect(deletedItem.name).toBe(item.name)
      expect(deletedItem.price).toBe(item.price)
      expect(deletedItem.description).toBe(item.description)
      expect((deletedItem.updatedAt as Date).getTime() > (insertedItem.updatedAt as Date).getTime()).toBe(true)
      expect(deletedItem.active).toBe(false)
    })

    it(`Should return null
        When delete not found a document to delete`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      await repository.insert(item)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const result: Item | null = await repository.delete(id)
      expect(result).toBeNull()
    })
  })
})
