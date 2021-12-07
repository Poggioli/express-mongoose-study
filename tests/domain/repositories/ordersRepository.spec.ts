import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import { OrdersRepository } from '../../../src/domain/repositories'
import OrderBuilder from '../../testsUtils/order'
import { Order } from '../../../src/domain/models'

describe('OrdersRepository', () => {
  let repository: OrdersRepository

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
  })

  beforeEach(() => {
    repository = new OrdersRepository()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  describe('insert', () => {
    it(`Should return an ObjectId
        When call insert
        With the right values`, async () => {
      expect.assertions(1)
      const order: Order = new OrderBuilder().build()
      const result = await repository.insert(order)
      expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
    })

    it(`Should return an ObjectId
        When call insert
        And observation is undefined
        With the right values`, async () => {
      expect.assertions(1)
      const order: Order = new OrderBuilder().observation(undefined).build()
      const result = await repository.insert(order)
      expect(mongoose.Types.ObjectId.isValid(result)).toBe(true)
    })

    describe('Validation Errors', () => {
      describe('total', () => {
        it(`Should throw an error
            When total is not present`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().total(undefined).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: total: Path `total` is required.')
        })

        it(`Should throw an error
            When total is not present`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().total(0.5).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: total: Path `total` (0.5) is less than minimum allowed value (1).')
        })
      })

      describe('items', () => {
        it(`Should throw an error
            When items is not present`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().items(undefined).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: items: items is shorter than the minimum allowed length (1).')
        })

        it(`Should throw an error
            When items is empty`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().items([]).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: items: items is shorter than the minimum allowed length (1).')
        })
      })

      describe('observation', () => {
        it(`Should throw an error
            When observation bigger than 300 characters`, async () => {
          expect.assertions(1)
          const observation: string = Array(301).fill('a').join('')
          const order = new OrderBuilder().observation(observation).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow(
              `ValidationError: observation: Path \`observation\` (\`${observation}\`) is longer than the maximum allowed length (300).`
            )
        })
      })

      describe('scheduledAt', () => {
        // ToDo fix this test
        xit(`Should throw an error
            When scheduledAt is not present`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().scheduledAt(undefined).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: scheduledAt: scheduledAt should be today or next days.')
        })

        it(`Should throw an error
            When scheduledAt is past date`, async () => {
          expect.assertions(1)
          const scheduledAtYesterday = new Date()
          scheduledAtYesterday.setDate(scheduledAtYesterday.getDate() - 1)
          const order = new OrderBuilder().scheduledAt(scheduledAtYesterday).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: scheduledAt: scheduledAt should be today or next days.')
        })
      })

      describe('stateType', () => {
        it(`Should throw an error
            When stateType is not present`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().stateType(undefined).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: stateType: Path `stateType` is required.')
        })

        it(`Should throw an error
            When stateType is not a valid enum value`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().stateType('teste').build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: stateType: `teste` is not a valid enum value for path `stateType`.')
        })
      })

      describe('user', () => {
        it(`Should throw an error
            When user is not present`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().user(undefined).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: user: Path `user` is required.')
        })
      })

      describe('status', () => {
        it(`Should throw an error
            When status is not present`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().status(undefined).build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: status: Path `status` is required.')
        })

        it(`Should throw an error
            When status is not a valid enum value`, async () => {
          expect.assertions(1)
          const order = new OrderBuilder().status('teste').build()
          await expect(repository.insert(order).then())
            .rejects
            .toThrow('ValidationError: status: `teste` is not a valid enum value for path `status`.')
        })
      })
    })
  })
})
