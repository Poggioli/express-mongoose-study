import request from 'supertest'
import http from 'http'
import db from '../../testsUtils/db'
import Application from '../../../src/application'

describe('ItemsController', () => {
  let server: http.Server

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
  })

  beforeEach(async () => {
    const app: Application = new Application()
    server = (await app.bootstrap()).listening()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  it(`Should return an Array
      When call the endpoint /items`, async () => {
    await request(server)
      .get('/v1/items')
      .then((result) => {
        expect(result.statusCode).toBe(200)
        expect(result.body).toStrictEqual([])
      })
  })
})
