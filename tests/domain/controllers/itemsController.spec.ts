import http from 'http'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import request from 'supertest'
import Application from '../../../src/application'
import { ForbiddenError } from '../../../src/core/customErrors'
import { Item } from '../../../src/domain/models'
import { CodeRoles } from '../../../src/domain/models/rolesModel'
import db from '../../testsUtils/db'
import ItemBuilder from '../../testsUtils/item'
import { createInvalidJwtRole } from '../../testsUtils/user'

describe('ItemsController', () => {
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
        When call the endpoint POST /items`, async () => {
      expect.assertions(1)
      const item: Item = new ItemBuilder().build()

      await request(server)
        .post('/v1/items')
        .send(item)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.ADM, CodeRoles.SYSADM], rolesId)
      const item: Item = new ItemBuilder().build()

      await request(server)
        .post('/v1/roles')
        .send(item)
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
        When call the endpoint PUT /items/:id`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
      const item = new ItemBuilder().name('new name').build()

      await request(server)
        .put('/v1/items/'.concat(id.toString()))
        .send(item)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When user don't have the necessary role`, async () => {
      expect.assertions(2)

      const rolesId = await db.createRoles().then()
      const jwt = createInvalidJwtRole([CodeRoles.ADM, CodeRoles.SYSADM], rolesId)
      const item: Item = new ItemBuilder().build()

      await request(server)
        .put('/v1/roles/'.concat(rolesId[0].id.toString()))
        .send(item)
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
        When call the endpoint DELETE /items/:id`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

      await request(server)
        .delete('/v1/items/'.concat(id.toString()))
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
        .delete('/v1/roles/'.concat(rolesId[0].id.toString()))
        .set('Cookie', 'jwtToken='.concat(jwt))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe(new ForbiddenError().message)
        })
    })
  })
})
