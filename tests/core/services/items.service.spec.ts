/* eslint-disable dot-notation */
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import ItemsService from '../../../src/core/services'
import ItemsRepository from '../../../src/core/repositories'
import { Item } from '../../../src/core/models'

const service = Object.getPrototypeOf(new ItemsService())
// const service = new ItemsService()
describe('ItemsService', () => {
  let request: Partial<Request>
  let response: Partial<Response>
  let spyResponseJson: jest.SpyInstance
  let spyResponseStatus: jest.SpyInstance
  let repository: ItemsRepository
  const next: NextFunction = jest.fn()

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

  describe('FindAll method', () => {
    it(`Should return a Item
        And status code 200
        When is a valid ID
        And Document exists`, async () => {
      expect.assertions(4)
      const itemToReturn: Partial<Item> = {
        name: 'name',
        price: 1,
        description: 'description',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        }
      }
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(itemToReturn as Item)
      await service.findById(request as Request, response as Response, next)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(200)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(itemToReturn)
    })

    it(`Should return a Item
        And status code 404
        When is a valid ID
        And Document don't exists`, async () => {
      expect.assertions(4)
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        }
      }
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null)
      await service.findById(request as Request, response as Response, next)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(404)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Document not found')
    })

    it(`Should return a status code 422
        When is an invalid ID`, async () => {
      expect.assertions(4)
      request = {
        params: {
          id: '123'
        }
      }
      await service.findById(request as Request, response as Response, next)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(422)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Id format is not valid')
    })

    it(`Should return an error message
        And status code 500
        When call findById`, async () => {
      expect.assertions(4)
      jest.spyOn(repository, 'findById').mockRejectedValueOnce({ message: 'Error message' })
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        }
      }
      await service
        .findById(request as Request, response as Response, next)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(500)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })
})
