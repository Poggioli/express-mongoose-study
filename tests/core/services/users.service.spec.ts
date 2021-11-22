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
  let repository: UsersRepository

  beforeEach(() => {
    response = {
      status: () => response as Response,
      json: jest.fn()
    }
    request = {}
    spyResponseStatus = jest.spyOn(response, 'status')
    spyResponseJson = jest.spyOn(response, 'json')
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
})
