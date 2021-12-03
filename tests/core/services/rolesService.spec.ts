import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { Role } from '../../../src/core/models'
import { RolesRepository } from '../../../src/core/repositories'
import { RolesService } from '../../../src/core/services'
import RoleBuilder from '../../testsUtils/role'

const service = Object.getPrototypeOf(new RolesService())
describe('RolesService', () => {
  let request: Partial<Request>
  let response: Partial<Response>
  let spyResponseJson: jest.SpyInstance
  let spyResponseStatus: jest.SpyInstance
  let repository: RolesRepository

  beforeEach(() => {
    response = {
      status: () => response as Response,
      json: jest.fn()
    }
    request = {}
    spyResponseStatus = jest.spyOn(response, 'status')
    spyResponseJson = jest.spyOn(response, 'json')
    repository = new RolesRepository()
    service._repository = repository
  })

  describe('insert', () => {
    it(`Should return the ID
        And status code 201
        When the body is valid`, async () => {
      expect.assertions(5)
      const role: Role = new RoleBuilder().build()
      const id = new mongoose.Types.ObjectId()
      request = {
        body: role
      }

      const roleSended = {
        name: role.name,
        description: role.description,
        code: role.code,
        access: role.access
      }

      jest.spyOn(repository, 'insert').mockResolvedValueOnce(id)
      const call = await service.insert()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(id.toString())
      expect(repository.insert).toHaveBeenCalledWith(roleSended)
    })
  })

  describe('update', () => {
    it(`Should return the Role who was updated
        And status code 200
        When the body is valid
        And ID is Valid`, async () => {
      expect.assertions(5)
      const role: Role = new RoleBuilder().build()
      const id = new mongoose.Types.ObjectId()
      request = {
        params: {
          id: id.toString()
        },
        body: role
      }

      const roleSended = {
        name: role.name,
        description: role.description,
        code: role.code,
        access: role.access
      }

      jest.spyOn(repository, 'update').mockResolvedValueOnce(role)
      const call = await service.update()
      await call(request as Request, response as Response)
      expect(spyResponseStatus).toHaveBeenCalledTimes(1)
      expect(spyResponseStatus).toHaveBeenCalledWith(StatusCodes.OK)
      expect(spyResponseJson).toHaveBeenCalledTimes(1)
      expect(spyResponseJson).toHaveBeenCalledWith(role)
      expect(repository.update).toHaveBeenCalledWith(id, roleSended)
    })
  })
})
