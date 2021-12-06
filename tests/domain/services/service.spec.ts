/* eslint-disable max-classes-per-file */
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose, { Document, Schema } from 'mongoose'
import { Repository } from '../../../src/domain/repositories'
import Service from '../../../src/domain/services/service'

interface Dummy extends Document {
  name: string,
  active?: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

const dummySchema = new Schema<Dummy>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const DummyModel = mongoose.model<Dummy>('Dummy', dummySchema)

class DummyRepository extends Repository<Dummy> {
  constructor() {
    super(DummyModel)
  }
}

class DummyBuilder {
  private _name: string | undefined

  private _active: boolean

  constructor() {
    this._name = 'name'
    this._active = true
  }

  public active(active: boolean): DummyBuilder {
    this._active = active
    return this
  }

  public name(name: string | undefined): DummyBuilder {
    this._name = name
    return this
  }

  public build(): Dummy {
    return ({
      name: this._name,
      active: this._active
    }) as Dummy
  }
}

class DummyService extends Service<Dummy, DummyRepository> {
  constructor() {
    super(new DummyRepository())
  }

  protected mapperRequest(value: any): Partial<Dummy> {
    return ({
      name: value.name,
      active: value.active
    })
  }
}

const service = Object.getPrototypeOf(new DummyService())
describe('DummyService', () => {
  let request: Partial<Request>
  let response: Partial<Response>
  let spyResponseJson: jest.SpyInstance
  let spyResponseStatus: jest.SpyInstance
  let spyResponseSend: jest.SpyInstance
  let repository: DummyRepository

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
    repository = new DummyRepository()
    service._repository = repository
  })

  describe('findAll', () => {
    it(`Should return a Dummy[]
        And status code 200
        When call findAll`, async () => {
      expect.assertions(4)
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([])
      const call = await service.findAll()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith([])
    })

    it(`Should return an error message
        And status code 500
        When call findAll`, async () => {
      expect.assertions(4)
      jest.spyOn(repository, 'findAll').mockRejectedValueOnce({ message: 'Error message' })
      const call = await service.findAll()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })

  describe('findById', () => {
    it(`Should return a Dummy
        And status code 200
        When is a valid ID
        And Document exists`, async () => {
      expect.assertions(4)
      const dummy: Dummy = new DummyBuilder().build()
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        }
      }
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(dummy)
      const call = await service.findById()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(dummy)
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

  describe('insert', () => {
    it(`Should return a ObjectId
        And status code 201
        When the body is valid`, async () => {
      expect.assertions(5)
      const dummy: Dummy = new DummyBuilder().build()
      request = {
        body: dummy
      }
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      jest.spyOn(repository, 'insert').mockResolvedValueOnce(id)
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(id.toString())
      expect(repository.insert).toHaveBeenCalledWith(dummy)
    })

    it(`Should return an array of message error
        And status code 422
        When the body is invalid`, async () => {
      expect.assertions(4)
      const dummy: Dummy = new DummyBuilder().name(undefined).build()
      request = {
        body: dummy
      }
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
      const dummy: Dummy = new DummyBuilder().build()
      request = {
        body: dummy
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

  describe('update', () => {
    let dummy: Dummy

    beforeEach(() => {
      dummy = new DummyBuilder().build()
    })

    it(`Should return the Dummy who was updated
        And status code 200
        When the body is valid
        And ID is Valid`, async () => {
      expect.assertions(5)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        },
        body: dummy
      }
      jest.spyOn(repository, 'update').mockResolvedValueOnce(dummy)
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(dummy)
      expect(repository.update).toHaveBeenCalledWith(id, dummy)
    })

    it(`Should return a status code 422
        When is an invalid ID`, async () => {
      expect.assertions(4)
      request = {
        params: {
          id: '123'
        },
        body: dummy
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
        body: dummy
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
        body: dummy
      }
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith('Error message')
    })
  })

  describe('delete', () => {
    let dummy: Dummy

    beforeEach(() => {
      dummy = new DummyBuilder().build()
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
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(dummy as Dummy)
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
})
