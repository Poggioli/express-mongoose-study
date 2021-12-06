/* eslint-disable max-classes-per-file */
import { Router } from 'express'
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import mongoose, { Document, Schema } from 'mongoose'
import request from 'supertest'
import Application from '../../../src/application'
import { Controller } from '../../../src/domain/controllers'
import { Repository } from '../../../src/domain/repositories'
import Service from '../../../src/domain/services/service'
import db from '../../testsUtils/db'

interface Dummy extends Document {
  name: string,
  active?: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

const dummySchema = new Schema<Dummy>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const DummyModel = mongoose.model<Dummy>('Dummy', dummySchema)

class DummyRepository extends Repository<Dummy> {
  constructor() {
    super(DummyModel)
  }
}

class DummyBuilder {
  private _name: string | undefined

  private _active: boolean

  constructor() {
    this._name = 'name'
    this._active = true
  }

  public active(active: boolean): DummyBuilder {
    this._active = active
    return this
  }

  public name(name: string | undefined): DummyBuilder {
    this._name = name
    return this
  }

  public build(): Dummy {
    return ({
      name: this._name,
      active: this._active
    }) as Dummy
  }
}

class DummyService extends Service<Dummy, DummyRepository> {
  constructor() {
    super(new DummyRepository())
  }

  protected mapperRequest(value: any): Partial<Dummy> {
    return ({
      name: value.name,
      active: value.active
    })
  }
}

class DummyController extends Controller {
  constructor(router: Router) {
    super(router, new DummyService(), DummyModel)
  }
}

describe('Controller', () => {
  let server: http.Server

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
    const app: Application = new Application()
    const router: Router = Router()
    // eslint-disable-next-line no-new
    const route = new DummyController(router)
    route.create()
    server = (await app.bootstrap().then((ap) => {
      // @ts-ignore
      ap._app.use('/v1', router)
      return ap
    })).listening()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => {
    await db.disconnect()
    server.close()
  })

  describe('findAll', () => {
    it(`Should return an Array
        When call the endpoint GET /dummies`, async () => {
      expect.assertions(2)
      await request(server)
        .get('/v1/dummies')
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.OK)
          expect(result.body).toStrictEqual([])
        })
    })
  })

  describe('insert', () => {
    it(`Should return an ObjectId value
        When call the endpoint POST /dummies`, async () => {
      expect.assertions(2)
      const dummy: Dummy = new DummyBuilder().build()
      await request(server)
        .post('/v1/dummies')
        .send(dummy)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.CREATED)
          expect(mongoose.Types.ObjectId.isValid(result.body)).toBe(true)
        })
    })
  })

  describe('findById', () => {
    it(`Should return a Dummy
        When call the endpoint GET /dummies/:id`, async () => {
      expect.assertions(2)
      const dummy: Dummy = new DummyBuilder().build()
      const id: mongoose.Types.ObjectId = await request(server)
        .post('/v1/dummies')
        .send(dummy)
        .then((result) => result.body)

      await request(server)
        .get('/v1/dummies/'.concat(id.toString()))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.OK)
          expect(result.body).toBeDefined()
        })
    })
  })

  describe('update', () => {
    it(`Should return an Item
        When call the endpoint PUT /dummies/:id`, async () => {
      expect.assertions(2)
      let dummy: Dummy = new DummyBuilder().build()
      const id: mongoose.Types.ObjectId = await request(server)
        .post('/v1/dummies')
        .send(dummy)
        .then((result) => result.body)

      dummy = new DummyBuilder().name('new name').build()
      await request(server)
        .put('/v1/dummies/'.concat(id.toString()))
        .send(dummy)
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.OK)
          expect(result.body.name).toBe('new name')
        })
    })
  })

  describe('delete', () => {
    it(`Should return an empty body
        When call the endpoint DELETE /dummies/:id`, async () => {
      expect.assertions(2)
      const dummy: Dummy = new DummyBuilder().build()
      const id: mongoose.Types.ObjectId = await request(server)
        .post('/v1/dummies')
        .send(dummy)
        .then((result) => result.body)

      await request(server)
        .delete('/v1/dummies/'.concat(id.toString()))
        .then((result) => {
          expect(result.statusCode).toBe(StatusCodes.NO_CONTENT)
          expect(result.body).toStrictEqual({})
        })
    })
  })
})
