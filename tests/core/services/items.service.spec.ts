import ItemsService from '../../../src/core/services'
import ItemsRepository from '../../../src/core/repositories'
import { Item } from '../../../src/core/models'

describe('ItemsService', () => {
  let service: ItemsService
  let repository: ItemsRepository

  beforeEach(() => {
    service = new ItemsService()
    repository = new ItemsRepository()
  })

  describe('FindAll method', () => {
    it(`Should return a Item[]
        When call findAll`, async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([])
      const result: Item[] = await service.findAll()
      expect(result).toStrictEqual([])
    })
  })
})
