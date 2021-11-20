import db from '../../testsUtils/db'
import ItemsRepository from '../../../src/core/repositories'

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

  it(`Should return an ItemInterface[]
      When call findAll`, async () => {
    const result = await repository.findAll()
    expect(result).toStrictEqual([])
  })
})
