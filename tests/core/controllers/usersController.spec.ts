/* eslint-disable import/no-extraneous-dependencies */
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import { advanceTo, clear } from 'jest-date-mock'
import request from 'supertest'
import Application from '../../../src/application'
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

  it(`Should return a statusCode 200
      When call the endpoint GET /users/email?email=teste@email.com`, async () => {
    expect.assertions(2)
    const user: User = new UserBuilder().build()
    const queryParams: URLSearchParams = new URLSearchParams({
      email: user.email
    })

    await request(server)
      .post('/v1/users')
      .send(user)

    await request(server)
      .get('/v1/users?'.concat(queryParams.toString()))
      .then((result) => {
        expect(result.statusCode).toBe(StatusCodes.OK)
        expect(result.body.email).toBe(user.email)
      })
  })

  it(`Should return a statusCode 204
      And jwtToken in cookie
      When call the endpoint POST /users/authenticate`, async () => {
    advanceTo(new Date(2021, 8, 8, 0, 0, 0, 0))
    const user: User = new UserBuilder().build()

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
          'jwtToken=Bearer%20eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibmFtZSIsImVtYWlsIjoiZW1haWxAdGVzdC5jb20iLCJleHAiOjE2MzExNDU2MDB9.f3wiiG7Vd0pgXxi4d2Lqf0Q-QSGKJRq-XW9ZIrR_bss',
          'Path=/',
          'HttpOnly'
        ]
        const cookies: string[] = result.header['set-cookie'][0].split(';').map((v: string) => v.trim())
        expect(cookies).toStrictEqual(expectedsCookies)
      })
    clear()
  })
})
