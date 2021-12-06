import http from 'http'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import request from 'supertest'
import { ForbiddenError } from '../../../src/core/customErrors'
import Application from '../../../src/application'
import { Role } from '../../../src/domain/models'
import { createInvalidJwtRole } from '../../testsUtils/user'
import db from '../../testsUtils/db'
import RoleBuilder from '../../testsUtils/role'
import { CodeRoles } from '../../../src/domain/models/rolesModel'

describe('GroupItemsController', () => {
  let server: http.Server

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
    const app: Application = new Application()
    server = (await app.bootstrap()).listening()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => {
    await db.disconnect()
    server.close()
  })

  describe('insert', () => {
    it(`Should return 401
        When uses JWTValidator
        When call the endpoint POST /groupItems`, async () => {
      expect.assertions(1)
      const role: Role = new RoleBuilder().build()

      await request(server)
        .post('/v1/groupItems')
        .send(role)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.SYSADM, CodeRoles.ADM], rolesId)
      const role: Role = new RoleBuilder().build()

      await request(server)
        .post('/v1/groupItems')
        .send(role)
        .set('Cookie', 'jwtToken='.concat(jwt))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe(new ForbiddenError().message)
        })
    })
  })

  describe('update', () => {
    it(`Should return 401
        When uses JWTValidator
        When call the endpoint PUT /groupItems/:id`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const role = new RoleBuilder().name('new name').build()

      await request(server)
        .put('/v1/groupItems/'.concat(id.toString()))
        .send(role)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.SYSADM, CodeRoles.ADM], rolesId)
      const role: Role = new RoleBuilder().build()

      await request(server)
        .put('/v1/groupItems/'.concat(rolesId[0].id.toString()))
        .send(role)
        .set('Cookie', 'jwtToken='.concat(jwt))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe(new ForbiddenError().message)
        })
    })
  })

  describe('delete', () => {
    it(`Should return 401
        When uses JWTValidator
        When call the endpoint DELETE /groupItems/:id`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

      await request(server)
        .delete('/v1/groupItems/'.concat(id.toString()))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.SYSADM, CodeRoles.ADM], rolesId)

      await request(server)
        .delete('/v1/groupItems/'.concat(rolesId[0].id.toString()))
        .set('Cookie', 'jwtToken='.concat(jwt))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe(new ForbiddenError().message)
        })
    })
  })
})
