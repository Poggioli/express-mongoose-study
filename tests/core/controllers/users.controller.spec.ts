import http from 'http'
import request from 'supertest'
import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import Application from '../../../src/application'
import { User } from '../../../src/core/models'

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

  it(`Should return an ObjectId value
      When call the endpoint POST /users`, async () => {
    const item: Partial<User> = {
      name: 'name',
      email: 'teste@email.com',
      password: 'password'
    }
    await request(server)
      .post('/v1/users')
      .send(item)
      .then((result) => {
        expect(result.statusCode).toBe(201)
        expect(mongoose.Types.ObjectId.isValid(result.body)).toBe(true)
      })
  })

  it(`Should return a statusCode 204
      When call the endpoint GET /users/email?email=teste@email.com`, async () => {
    const queryParams: URLSearchParams = new URLSearchParams({
      email: 'teste@email.com'
    })
    const item: Partial<User> = {
      name: 'name',
      email: 'teste@email.com',
      password: 'password'
    }
    await request(server)
      .post('/v1/users')
      .send(item)

    await request(server)
      .get('/v1/users/email?'.concat(queryParams.toString()))
      .then((result) => {
        expect(result.statusCode).toBe(204)
        expect(result.body).toStrictEqual({})
      })
  })

  it(`Should return an Item
      When call the endpoint GET /users/:id`, async () => {
    const item: Partial<User> = {
      name: 'name',
      email: 'teste@email.com',
      password: 'password'
    }
    const id: mongoose.Types.ObjectId = await request(server)
      .post('/v1/users')
      .send(item)
      .then((result) => result.body)

    await request(server)
      .get('/v1/users/'.concat(id.toString()))
      .then((result) => {
        expect(result.statusCode).toBe(200)
        const itemReturned: User = result.body
        expect(itemReturned.name).toBe('name')
        expect(itemReturned.password).toBeUndefined()
        expect(itemReturned.email).toBe('teste@email.com')
        expect(itemReturned._id).toBe(id)
        expect(itemReturned.createdAt).toBeDefined()
        expect(itemReturned.updatedAt).toBeDefined()
      })
  })
})