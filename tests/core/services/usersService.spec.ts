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

  describe('FindById method', () => {
    it(`Should return a User
        And status code 200
        When is a valid ID
        And Document exists`, async () => {
      expect.assertions(4)
      const userToReturn: Partial<User> = {
        name: 'name',
        password: 'password',
        email: 'test@email.com'
      }
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        }
      }
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(userToReturn as User)
      const call = await service.findById()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(userToReturn)
    })

    it(`Should return a null
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
      const call = await service.findById()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Document Not Found')
    })

    it(`Should return a status code 422
        When is an invalid ID`, async () => {
      expect.assertions(4)
      request = {
        params: {
          id: '123'
        }
      }
      const call = await service.findById()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY)
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
      const call = await service.findById()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })

  describe('Update method', () => {
    let user: Partial<User>

    beforeEach(() => {
      user = {
        name: 'name',
        email: 'teste@email.com'
      }
    })

    it(`Should return the User Who was updated
        And status code 200
        When the body is valid
        And ID is Valid`, async () => {
      expect.assertions(5)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        },
        body: user
      }
      jest.spyOn(repository, 'update').mockResolvedValueOnce(user as User)
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(user)
      expect(repository.update).toHaveBeenCalledWith(id, user)
    })

    it(`Should return a status code 422
        When is an invalid ID`, async () => {
      expect.assertions(4)
      request = {
        params: {
          id: '123'
        },
        body: user
      }
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Id format is not valid')
    })

    it(`Should return null
        And status code 404
        When is a valid ID
        And Document don't exists`, async () => {
      expect.assertions(4)
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        },
        body: user
      }
      jest.spyOn(repository, 'update').mockResolvedValueOnce(null)
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Document Not Found')
    })

    it(`Should return an error message
        And status code 500
        When call Update`, async () => {
      expect.assertions(4)
      jest.spyOn(repository, 'update').mockRejectedValueOnce({ message: 'Error message' })
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        },
        body: user
      }
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })

  describe('Delete method', () => {
    let user: Partial<User>

    beforeEach(() => {
      user = {
        name: 'name',
        email: 'email@test.com',
        password: 'password'
      }
    })

    it(`Should return status code 204
        When ID is Valid`, async () => {
      expect.assertions(5)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        }
      }
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(user as User)
      const call = await service.delete()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
      expect(spyResponseJson).toHaveBeenCalledTimes(0)
      expect(spyResponseSend).toHaveBeenCalledTimes(1)
      expect(repository.delete).toHaveBeenCalledWith(id)
    })

    it(`Should return a status code 422
        When is an invalid ID`, async () => {
      expect.assertions(4)
      request = {
        params: {
          id: '123'
        }
      }
      const call = await service.delete()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Id format is not valid')
    })

    it(`Should return an error message
        And status code 500
        When call Delete`, async () => {
      expect.assertions(4)
      jest.spyOn(repository, 'delete').mockRejectedValueOnce({ message: 'Error message' })
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        }
      }
      const call = await service.delete()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })

  describe('Authenticate method', () => {
    it(`Should return status code 204
        And set header with jwtToken`, async () => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date(2021, 8, 8, 0, 0, 0, 0).getTime())
      expect.assertions(5)
      // eslint-disable-next-line max-len
      const jwtToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImVtYWlsQHRlc3QuY29tIiwiZXhwIjoxNjMxMTQ1NjAwfQ.X54ILyp5MCU_6cHwRslrv6YzcBW536B9z1t1gd3k_TI'
      jest.spyOn(response, 'cookie')
      const user: Partial<User> = {
        email: 'email@test.com',
        password: 'password'
      }

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
        jwtToken,
        {
          path: '/',
          secure: true,
          httpOnly: true
        }
      )
      jest.useRealTimers()
    })

    it('Should return status code 401', async () => {
      expect.assertions(4)
      const user: Partial<User> = {
        email: 'email@test.com',
        password: 'password'
      }

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
      const user: Partial<User> = {
        email: 'email@test.com',
        password: 'password'
      }

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
