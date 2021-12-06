/* eslint-disable import/no-extraneous-dependencies */
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import { advanceTo, clear } from 'jest-date-mock'
import mongoose from 'mongoose'
import request from 'supertest'
import Application from '../../../src/application'
import Jwt from '../../../src/core/auth/jwt'
import { User } from '../../../src/domain/models'
import db from '../../testsUtils/db'
import UserBuilder from '../../testsUtils/user'
import { jwtValid } from '../../testsUtils/jwt'

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

  describe('update', () => {
    it(`Should return 401
          When uses JWTValidator
          And call the endpoint PUT /users/:id without JWT cookie`, async () => {
      expect.assertions(1)
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

      await request(server)
        .put('/v1/users/'.concat(id.toString()))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED)
        })
    })

    it(`Should return 403
        When uses verifyIfCanUpdate
        And call the endpoint PUT /users/:id with users different`, async () => {
      expect.assertions(2)
      const otherUser = new UserBuilder().email('otherUser@email.com').build()
      const idOtherUser: mongoose.Types.ObjectId = await request(server).post('/v1/users').send(otherUser).then((result) => result.body)
      await request(server)
        .put('/v1/users/'.concat(idOtherUser.toString()))
        .set('Cookie', jwtValid)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.FORBIDDEN)
          expect(result.body).toBe('You cannot update a user other than you')
        })
    })
  })

  it(`Should return statusCode 404
      When call the endpoint GET /users`, async () => {
    expect.assertions(2)
    await request(server)
      .get('/v1/users')
      .then((result) => {
        expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
        expect(result.body).toBe('Cannot GET - /users')
      })
  })

  it(`Should return a statusCode 204
      And jwtToken in cookie
      When call the endpoint POST /users/authenticate`, async () => {
    expect.assertions(2)
    advanceTo(new Date(2021, 8, 8, 0, 0, 0, 0))
    const user: User = new UserBuilder().build()

    const jwt: string = new Jwt().createJwt({
      name: user.name,
      email: user.email,
      roles: []
    })

    await request(server)
      .post('/v1/users')
      .send(user)

    await request(server)
      .post('/v1/users/authenticate')
      .send(user)
      .then((result) => {
        expect(result.statusCode).toBe(StatusCodes.NO_CONTENT)
        const expectedsCookies: string[] = [
          // eslint-disable-next-line max-len
          'jwtToken=Bearer%20'.concat(jwt),
          'Path=/',
          'HttpOnly'
        ]
        const cookies: string[] = result.header['set-cookie'][0].split(';').map((v: string) => v.trim())
        expect(cookies).toStrictEqual(expectedsCookies)
      })
    clear()
  })
})
