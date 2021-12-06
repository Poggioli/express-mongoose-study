/* eslint-disable dot-notation */
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import { ItemsService } from '../../../src/domain/services'
import { ItemsRepository } from '../../../src/domain/repositories'
import { Item } from '../../../src/domain/models'
import ItemBuilder from '../../testsUtils/item'

const service = Object.getPrototypeOf(new ItemsService())
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
    service._repository = repository
  })

  describe('insert', () => {
    it(`Should return a ObjectId
        And status code 201
        When the body is valid`, async () => {
      expect.assertions(5)
      const item: Item = new ItemBuilder().active(undefined).build()
      request = {
        body: item
      }
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      jest.spyOn(repository, 'insert').mockResolvedValueOnce(id)
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(id.toString())
      expect(repository.insert).toHaveBeenCalledWith(item)
    })
  })

  describe('update', () => {
    it(`Should return the Item Who was updated
        And status code 200
        When the body is valid
        And ID is Valid`, async () => {
      expect.assertions(5)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const item = new ItemBuilder().active(undefined).build()
      request = {
        params: {
          id: id.toString()
        },
        body: item
      }
      jest.spyOn(repository, 'update').mockResolvedValueOnce(item as Item)
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(item)
      expect(repository.update).toHaveBeenCalledWith(id, item)
    })
  })
})
