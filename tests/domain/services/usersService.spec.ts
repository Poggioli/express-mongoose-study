import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { User } from '../../../src/domain/models'
import { UsersRepository } from '../../../src/domain/repositories'
import { UsersService } from '../../../src/domain/services'
import UserBuilder from '../../testsUtils/user'
import Jwt from '../../../src/core/auth/jwt'

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
      cookie: () => response as Response,
      json: jest.fn(),
      send: jest.fn()
    }
    request = {}
    spyResponseStatus = jest.spyOn(response, 'status')
    spyResponseJson = jest.spyOn(response, 'json')
    spyResponseSend = jest.spyOn(response, 'send')
    repository = new UsersRepository()
    service._repository = repository
  })

  describe('insert', () => {
    it(`Should return the ID
        And status code 201
        When the body is valid`, async () => {
      expect.assertions(5)
      const user: User = new UserBuilder().build()
      const id = new mongoose.Types.ObjectId()
      request = {
        body: user
      }

      const userSended = {
        name: user.name,
        email: user.email,
        password: user.password,
        roles: user.roles
      }

      jest.spyOn(repository, 'insert').mockResolvedValueOnce(id)
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(id.toString())
      expect(repository.insert).toHaveBeenCalledWith(userSended)
    })
  })

  describe('update', () => {
    it(`Should return the User Who was updated
        And status code 200
        When the body is valid
        And ID is Valid`, async () => {
      expect.assertions(5)
      const user: User = new UserBuilder().build()
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        },
        body: user
      }

      const userSended = {
        name: user.name,
        email: user.email,
        roles: user.roles
      }

      jest.spyOn(repository, 'update').mockResolvedValueOnce(user)
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(user)
      expect(repository.update).toHaveBeenCalledWith(id, userSended)
    })
  })

  describe('authenticate', () => {
    it(`Should return status code 204
        And set header with jwtToken`, async () => {
      expect.assertions(5)
      jest
        .useFakeTimers()
        .setSystemTime(new Date(2021, 8, 8, 0, 0, 0, 0).getTime())
      jest.spyOn(response, 'cookie')
      const user: User = new UserBuilder().active(undefined).build()

      const jwt: string = new Jwt().createJwt({
        name: user.name,
        email: user.email,
        roles: user.roles
      })

      request = {
        body: user
      }

      jest.spyOn(repository, 'authenticate').mockResolvedValue(user as User)
      const call = await service.authenticate()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
      expect(spyResponseSend).toHaveBeenCalledTimes(1)
      expect(response.cookie).toHaveBeenCalledTimes(1)
      expect(response.cookie).toHaveBeenCalledWith(
        'jwtToken',
        'Bearer '.concat(jwt),
        {
          path: '/',
          secure: false,
          httpOnly: true
        }
      )
      jest.useRealTimers()
    })

    it('Should return status code 401', async () => {
      expect.assertions(4)
      const user: User = new UserBuilder().active(undefined).build()
      request = {
        body: user
      }

      jest.spyOn(repository, 'authenticate').mockResolvedValue(null)
      const call = await service.authenticate()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.FORBIDDEN)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Forbidden')
    })

    it(`Should return an error message
        And status code 500
        When call Authenticate`, async () => {
      expect.assertions(4)
      const user: User = new UserBuilder().active(undefined).build()
      request = {
        body: user
      }
      jest.spyOn(repository, 'authenticate').mockRejectedValueOnce({ message: 'Error message' })
      const call = await service.authenticate()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })
})
