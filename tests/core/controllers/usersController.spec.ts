/* eslint-disable import/no-extraneous-dependencies */
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import { advanceTo, clear } from 'jest-date-mock'
import request from 'supertest'
import Application from '../../../src/application'
import Jwt from '../../../src/core/auth/jwt'
import { User } from '../../../src/core/models'
import db from '../../testsUtils/db'
import UserBuilder from '../../testsUtils/user'

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
