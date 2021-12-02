import request from 'supertest'
import http from 'http'
import mongoose from 'mongoose'
import db from '../../testsUtils/db'
import Application from '../../../src/application'
import { Item } from '../../../src/core/models'
import { jwtInvalid, jwtValid } from '../../testsUtils/jwt'

describe('ItemsController', () => {
  let server: http.Server

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
    const app: Application = new Application()
    server = (await app.bootstrap()).listening()
  })

  beforeEach(async () => {
    await db.createDefaultUser()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => {
    await db.disconnect()
    server.close()
  })

  it(`Should return an Array
      When call the endpoint GET /items`, async () => {
    await request(server)
      .get('/v1/items')
      .then((result) => {
        expect(result.statusCode).toBe(200)
        expect(result.body).toStrictEqual([])
      })
  })

  describe('insert', () => {
    it(`Should return an ObjectId value
      When call the endpoint POST /items`, async () => {
      const item: Partial<Item> = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      await request(server)
        .post('/v1/items')
        .set('Cookie', jwtValid)
        .send(item)
        .then((result) => {
          expect(result.statusCode).toBe(201)
          expect(mongoose.Types.ObjectId.isValid(result.body)).toBe(true)
        })
    })

    it(`Should return 403
        When cookie is invalid`, async () => {
      const item: Partial<Item> = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      await request(server)
        .post('/v1/items')
        .set('Cookie', jwtInvalid)
        .send(item)
        .then((result) => {
          expect(result.statusCode).toBe(403)
        })
    })
  })

  it(`Should return an Item
      When call the endpoint GET /items/:id`, async () => {
    const item: Partial<Item> = {
      name: 'name',
      price: 1,
      description: 'description'
    }
    const id: mongoose.Types.ObjectId = await request(server)
      .post('/v1/items')
      .set('Cookie', jwtValid)
      .send(item)
      .then((result) => result.body)

    await request(server)
      .get('/v1/items/'.concat(id.toString()))
      .then((result) => {
        expect(result.statusCode).toBe(200)
        const itemReturned: Item = result.body
        expect(itemReturned.name).toBe('name')
        expect(itemReturned.price).toBe(1)
        expect(itemReturned.description).toBe('description')
        expect(itemReturned._id).toBe(id)
        expect(itemReturned.createdAt).toBeDefined()
        expect(itemReturned.updatedAt).toBeDefined()
      })
  })

  describe('update', () => {
    it(`Should return an Item
        When call the endpoint PUT /items/:id`, async () => {
      const item: Partial<Item> = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id: mongoose.Types.ObjectId = await request(server)
        .post('/v1/items')
        .set('Cookie', jwtValid)
        .send(item)
        .then((result) => result.body)

      item.name = 'new name'
      await request(server)
        .put('/v1/items/'.concat(id.toString()))
        .send(item)
        .set('Cookie', jwtValid)
        .then((result) => {
          expect(result.statusCode).toBe(200)
          const itemReturned: Item = result.body
          expect(itemReturned.name).toBe('new name')
          expect(itemReturned.price).toBe(1)
          expect(itemReturned.description).toBe('description')
          expect(itemReturned._id).toBe(id)
          expect(itemReturned.createdAt).toBeDefined()
          expect(itemReturned.updatedAt).toBeDefined()
        })
    })

    it(`Should return 403
        When cookie is invalid`, async () => {
      const item: Partial<Item> = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id: mongoose.Types.ObjectId = await request(server)
        .post('/v1/items')
        .set('Cookie', jwtValid)
        .send(item)
        .then((result) => result.body)

      item.name = 'new name'
      await request(server)
        .put('/v1/items/'.concat(id.toString()))
        .send(item)
        .set('Cookie', jwtInvalid)
        .then((result) => {
          expect(result.statusCode).toBe(403)
        })
    })
  })

  describe('delete', () => {
    it(`Should return an empty body
      When call the endpoint DELETE /items/:id`, async () => {
      const item: Partial<Item> = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id: mongoose.Types.ObjectId = await request(server)
        .post('/v1/items')
        .set('Cookie', jwtValid)
        .send(item)
        .then((result) => result.body)

      await request(server)
        .delete('/v1/items/'.concat(id.toString()))
        .set('Cookie', jwtValid)
        .then((result) => {
          expect(result.statusCode).toBe(204)
          expect(result.body).toStrictEqual({})
        })
    })

    it(`Should return 403
        When cookie is invalid`, async () => {
      const item: Partial<Item> = {
        name: 'name',
        price: 1,
        description: 'description'
      }
      const id: mongoose.Types.ObjectId = await request(server)
        .post('/v1/items')
        .set('Cookie', jwtValid)
        .send(item)
        .then((result) => result.body)

      await request(server)
        .delete('/v1/items/'.concat(id.toString()))
        .set('Cookie', jwtInvalid)
        .then((result) => {
          expect(result.statusCode).toBe(403)
        })
    })
  })
})
