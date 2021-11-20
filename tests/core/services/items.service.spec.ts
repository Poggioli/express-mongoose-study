/* eslint-disable dot-notation */
import ItemsService from '../../../src/core/services'
import { Item } from '../../../src/core/models'

describe('ItemsService', () => {
  let service: ItemsService

  beforeEach(() => {
    service = new ItemsService()
  })

  describe('FindAll method', () => {
    it(`Should return a Item[]
        When call findAll`, async () => {
      jest.spyOn(service['repository'], 'findAll').mockResolvedValueOnce([])
      const result: Item[] = await service.findAll()
      expect(result).toStrictEqual([])
    })
  })
})
