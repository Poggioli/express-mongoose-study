import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { User } from '../../../src/core/models'
import { UsersRepository } from '../../../src/core/repositories'
import { UsersService } from '../../../src/core/services'

const service = Object.getPrototypeOf(new UsersService())
describe('UsersService', () => {
  let request: Partial<Request>
  let response: Partial<Response>
  let spyResponseJson: jest.SpyInstance
  let spyResponseStatus: jest.SpyInstance
  let spyResponseSend: jest.SpyInstance
  let repository: UsersRepository

  beforeEach(() => {
    response = {
      status: () => response as Response,
      json: jest.fn(),
      send: jest.fn()
    }
    request = {}
    spyResponseStatus = jest.spyOn(response, 'status')
    spyResponseJson = jest.spyOn(response, 'json')
    spyResponseSend = jest.spyOn(response, 'send')
    repository = new UsersRepository()
    service.repository = repository
  })

  describe('Insert method', () => {
    it(`Should return a ObjectId
        And status code 201
        When the body is valid`, async () => {
      expect.assertions(5)
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      request = {
        body: user
      }
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      jest.spyOn(repository, 'insert').mockResolvedValueOnce(id)
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(id.toString())
      expect(repository.insert).toHaveBeenCalledWith(user)
    })

    it(`Should return an array of message error
        And status code 422
        When the body is invalid`, async () => {
      expect.assertions(4)
      const user: Partial<User> = {
        email: 'email@test.com',
        password: 'password'
      }
      request = {
        body: user
      }
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      jest.spyOn(repository, 'insert').mockRejectedValue({
        name: 'ValidationError',
        errors: {
          name: {
            message: 'ValidatorError: Path `name` is required'
          }
        }
      })
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(['ValidatorError: Path `name` is required'])
    })

    it(`Should return an error message
        And status code 500
        When call insert`, async () => {
      expect.assertions(4)
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      request = {
        body: user
      }
      jest.spyOn(repository, 'insert').mockRejectedValueOnce({ message: 'Error message' })
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })

  describe('FindByEmail method', () => {
    it(`Should return a status code 204
        When email exists`, async () => {
      expect.assertions(3)
      const user: Partial<User> = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
      request = {
        query: {
          email: 'email@test.com'
        }
      }
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(user as User)
      const call = await service.findByEmail()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
      expect(spyResponseSend).toHaveBeenCalledTimes(1)
    })

    it(`Should return a status code 404
        When email don't exists`, async () => {
      expect.assertions(4)
      request = {
        query: {
          email: 'email@test.com'
        }
      }
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(null)
      const call = await service.findByEmail()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Email not found')
    })

    it(`Should return a status code 400
        When email isn't provided`, async () => {
      expect.assertions(4)
      request = {
        query: {}
      }
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(null)
      const call = await service.findByEmail()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Email is required')
    })

    it(`Should return an error message
        And status code 500
        When call findById`, async () => {
      expect.assertions(4)
      jest.spyOn(repository, 'findByEmail').mockRejectedValueOnce({ message: 'Error message' })
      const id = new mongoose.Types.ObjectId()
      request = {
        query: {
          email: 'email@test.com'
        }
      }
      const call = await service.findByEmail()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })
})
