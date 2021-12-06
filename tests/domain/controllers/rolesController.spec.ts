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

describe('RolesControlles', () => {
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

  describe('findAll', () => {
    it(`Should return 401
        When uses JWTValidator
        And call the endpoint GET /roles`, async () => {
      expect.assertions(1)

      await request(server)
        .get('/v1/roles')
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.ADM, CodeRoles.SYSADM], rolesId)
      await request(server)
        .get('/v1/roles')
        .set('Cookie', 'jwtToken='.concat(jwt))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe(new ForbiddenError().message)
        })
    })
  })

  describe('insert', () => {
    it(`Should return 401
        When uses JWTValidator
        When call the endpoint POST /roles`, async () => {
      expect.assertions(1)
      const role: Role = new RoleBuilder().build()

      await request(server)
        .post('/v1/roles')
        .send(role)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.SYSADM], rolesId)
      const role: Role = new RoleBuilder().build()

      await request(server)
        .post('/v1/roles')
        .send(role)
        .set('Cookie', 'jwtToken='.concat(jwt))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe(new ForbiddenError().message)
        })
    })
  })

  describe('findById', () => {
    it(`Should return 401
        When uses JWTValidator
        When call the endpoint GET /roles/:id`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

      await request(server)
        .get('/v1/roles/'.concat(id.toString()))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.ADM, CodeRoles.SYSADM], rolesId)
      await request(server)
        .get('/v1/roles/'.concat(rolesId[0].id.toString()))
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
        When call the endpoint PUT /roles/:id`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const role = new RoleBuilder().name('new name').build()

      await request(server)
        .put('/v1/roles/'.concat(id.toString()))
        .send(role)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.SYSADM], rolesId)
      const role: Role = new RoleBuilder().build()

      await request(server)
        .put('/v1/roles/'.concat(rolesId[0].id.toString()))
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
        When call the endpoint DELETE /roles/:id`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

      await request(server)
        .delete('/v1/roles/'.concat(id.toString()))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.SYSADM], rolesId)

      await request(server)
        .delete('/v1/roles/'.concat(rolesId[0].id.toString()))
        .set('Cookie', 'jwtToken='.concat(jwt))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe(new ForbiddenError().message)
        })
    })
  })
})
