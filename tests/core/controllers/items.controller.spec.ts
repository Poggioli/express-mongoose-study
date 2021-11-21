import request from 'supertest'
import http from 'http'
import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import Application from '../../../src/application'
import { Item } from '../../../src/core/models'

describe('ItemsController', () => {
  let server: http.Server

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
    const app: Application = new Application()
    server = (await app.bootstrap()).listening()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  it(`Should return an Array
      When call the endpoint GET /items`, async () => {
    await request(server)
      .get('/v1/items')
      .then((result) => {
        expect(result.statusCode).toBe(200)
        expect(result.body).toStrictEqual([])
      })
  })

  it(`Should return an ObjectId value
      When call the endpoint POST /items`, async () => {
    const item: Partial<Item> = {
      name: 'name',
      price: 1,
      description: 'description'
    }
    await request(server)
      .post('/v1/items')
      .send(item)
      .then((result) => {
        expect(result.statusCode).toBe(201)
        expect(mongoose.Types.ObjectId.isValid(result.body)).toBe(true)
      })
  })
})