import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import ItemsRepository from '../../../src/core/repositories'
import { Item } from '../../../src/core/models/items.models'

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
    it(`Should return an ItemInterface[]
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
        await expect(repository.insert(item)).rejects.toThrow('Item validation failed: name: Path `name` is required.')
      })

      it(`Should return an Error
          When call insert
          Without price`, async () => {
        const item: any = {
          name: 'name',
          description: 'description'
        }
        await expect(repository.insert(item)).rejects.toThrow('Item validation failed: price: Path `price` is required.')
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
          .toThrow('Item validation failed: price: Path `price` (0.5) is less than minimum allowed value (1).')
      })

      it(`Should return an Error
          When call insert
          Without description`, async () => {
        const item: any = {
          name: 'name',
          price: 1
        }
        await expect(repository.insert(item)).rejects.toThrow('Item validation failed: description: Path `description` is required.')
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
          .toThrow(`Item validation failed: description: Path \`description\` (\`${description}\`) is longer than the maximum allowed length (300).`)
      })
    })
  })

  describe('FindById method', () => {
    it(`Should return an ItemInterface
        When call findById
        With description, name and price saved before`, async () => {
      const item: any = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id = await repository.insert(item)
      const result: Item = await repository.findById(id)
      expect(result.description).toBe('description')
      expect(result.name).toBe('name')
      expect(result.price).toBe(1)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })
  })
})
