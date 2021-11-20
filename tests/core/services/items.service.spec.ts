/* eslint-disable dot-notation */
import { Request, Response } from 'express'
import ItemsService from '../../../src/core/services'
import ItemsRepository from '../../../src/core/repositories'

const service = Object.getPrototypeOf(new ItemsService())
// const service = new ItemsService()
describe('ItemsService', () => {
  let request: Partial<Request>
  let response: Partial<Response>
  let spyResponseJson: jest.SpyInstance
  let spyResponseStatus: jest.SpyInstance
  let repository: ItemsRepository

  beforeEach(() => {
    response = {
      status: () => response as Response,
      json: jest.fn()
    }
    request = {}
    spyResponseStatus = jest.spyOn(response, 'status')
    spyResponseJson = jest.spyOn(response, 'json')
    repository = new ItemsRepository()
    service.repository = repository
  })

  describe('FindAll method', () => {
    it(`Should return a Item[]
        And status code 200
        When call findAll`, async () => {
      expect.assertions(4)
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([])
      await service.findAll(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(200)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith([])
    })

    it(`Should return an error message
        And status code 500
        When call findAll`, async () => {
      jest.spyOn(repository, 'findAll').mockRejectedValueOnce({ message: 'Error message' })
      expect.assertions(4)
      await service
        .findAll(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(500)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })
})
