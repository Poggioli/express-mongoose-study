import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { GroupItem } from '../../../src/domain/models'
import { GroupItemsRepository } from '../../../src/domain/repositories'
import { GroupItemsService } from '../../../src/domain/services'
import GroupItemBuilder from '../../testsUtils/groupItem'

const service = Object.getPrototypeOf(new GroupItemsService())
describe('GroupItemsService', () => {
  let request: Partial<Request>
  let response: Partial<Response>
  let spyResponseJson: jest.SpyInstance
  let spyResponseStatus: jest.SpyInstance
  let repository: GroupItemsRepository

  beforeEach(() => {
    response = {
      status: () => response as Response,
      json: jest.fn()
    }
    request = {}
    spyResponseStatus = jest.spyOn(response, 'status')
    spyResponseJson = jest.spyOn(response, 'json')
    repository = new GroupItemsRepository()
    service._repository = repository
  })

  describe('insert', () => {
    it(`Should return the ID
        And status code 201
        When the body is valid`, async () => {
      expect.assertions(5)
      const groupItem: GroupItem = new GroupItemBuilder().build()
      const id = new mongoose.Types.ObjectId()
      request = {
        body: groupItem
      }

      const groupItemSended = {
        name: groupItem.name,
        description: groupItem.description,
        items: groupItem.items
      }

      jest.spyOn(repository, 'insert').mockResolvedValueOnce(id)
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(id.toString())
      expect(repository.insert).toHaveBeenCalledWith(groupItemSended)
    })
  })

  describe('update', () => {
    it(`Should return the groupItem who was updated
        And status code 200
        When the body is valid
        And ID is Valid`, async () => {
      expect.assertions(5)
      const groupItem: GroupItem = new GroupItemBuilder().build()
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        },
        body: groupItem
      }

      const groupItemSended = {
        name: groupItem.name,
        description: groupItem.description,
        items: groupItem.items
      }

      jest.spyOn(repository, 'update').mockResolvedValueOnce(groupItem)
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(groupItem)
      expect(repository.update).toHaveBeenCalledWith(id, groupItemSended)
    })
  })
})
