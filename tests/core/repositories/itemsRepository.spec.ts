import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import { ItemsRepository } from '../../../src/core/repositories'

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

  describe('insert', () => {
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
})
