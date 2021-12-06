/* eslint-disable max-classes-per-file */
import mongoose, { Document, Schema } from 'mongoose'
import { Repository } from '../../../src/domain/repositories'
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
  private _name: string

  private _active: boolean

  constructor() {
    this._name = 'name'
    this._active = true
  }

  public active(active: boolean): DummyBuilder {
    this._active = active
    return this
  }

  public name(name: string): DummyBuilder {
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

describe('DummyRepository', () => {
  let repository: DummyRepository

  beforeAll(async () => {
    await db.createDB()
      .then(() => db.connect())
  })

  beforeEach(() => {
    repository = new DummyRepository()
  })

  afterEach(async () => { await db.clear() })

  afterAll(async () => { await db.disconnect() })

  describe('findAll', () => {
    it('Should return an array of Dummy', async () => {
      expect.assertions(1)
      const result = await repository.findAll()
      expect(result).toStrictEqual([])
    })

    it('Should return an array of only activated Dummy', async () => {
      expect.assertions(2)
      const active = new DummyModel(new DummyBuilder().name('active').build())
      const disable = new DummyModel(new DummyBuilder().name('disable').active(false).build())
      await active.save().then(() => disable.save().then())

      const result = await repository.findAll()
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('active')
    })
  })

  describe('findById', () => {
    it(`Should return a Dummy
        When id exists`, async () => {
      expect.assertions(1)
      const dummy = new DummyModel(new DummyBuilder().build())
      const id: mongoose.Types.ObjectId = await dummy.save().then((r) => (r as Dummy)._id)
      const result = await repository.findById(id)
      expect(result).toBeTruthy()
    })

    it(`Should return null
        When id doesn't exists`, async () => {
      expect.assertions(1)
      const result = await repository.findById(new mongoose.Types.ObjectId())
      expect(result).toBeNull()
    })

    it(`Should return null
        When id exists
        And the dummy is not activated`, async () => {
      expect.assertions(2)
      const dummy = new DummyModel(new DummyBuilder().active(false).build())
      const id: mongoose.Types.ObjectId = await dummy.save().then((r) => (r as Dummy)._id)
      const result = await repository.findById(id)
      expect(mongoose.Types.ObjectId.isValid(id)).toBe(true)
      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it(`Should return an id
        When is a valid object`, async () => {
      expect.assertions(1)
      const dummy = new DummyBuilder().build()
      const result: Dummy = await repository.insert(dummy).then()
      expect(mongoose.Types.ObjectId.isValid(result.id)).toBe(true)
    })

    describe('Validation Errors', () => {
      describe('Name', () => {
        it(`Should throw an error
            When name is not present`, async () => {
          expect.assertions(1)
          const dummy = new DummyBuilder().build()
          // @ts-ignore
          delete dummy.name
          await expect(repository.insert(dummy).then())
            .rejects
            .toThrow('ValidationError: name: Path `name` is required.')
        })
      })
    })
  })

  describe('update', () => {
    it(`Should return a Dummy updated
        When update works`, async () => {
      expect.assertions(1)
      const dummy = new DummyModel(new DummyBuilder().build())
      const id: mongoose.Types.ObjectId = await dummy.save().then((r) => (r as Dummy)._id)
      dummy.name = 'Name updated'
      const result = await repository.update(id, dummy) as Dummy
      expect(result.name).toBe('Name updated')
    })

    it(`Should change updatedAt
        When update works`, async () => {
      expect.assertions(1)
      const dummy = new DummyModel(new DummyBuilder().build())
      const id: mongoose.Types.ObjectId = await dummy.save().then((r) => (r as Dummy)._id)
      const oldDummy: Dummy = await DummyModel.findOne({ _id: id }).then() as Dummy
      dummy.name = 'Name updated'
      const result: Dummy = await repository.update(id, dummy).then() as Dummy
      // @ts-ignore
      expect(result.updatedAt > oldDummy.updatedAt).toBe(true)
    })

    it(`Should return null
        When id doesn't exists`, async () => {
      expect.assertions(1)
      const dummy = new DummyModel(new DummyBuilder().build())
      await dummy.save().then()
      const result = await repository.update(new mongoose.Types.ObjectId(), dummy)
      expect(result).toBeNull()
    })

    it(`Should throw an error
        When name is not presente`, async () => {
      expect.assertions(1)
      const dummy = new DummyModel(new DummyBuilder().build())
      const id: mongoose.Types.ObjectId = await dummy.save().then((r) => (r as Dummy)._id)
      const newDummy = new DummyBuilder().name('').build()
      await expect(repository.update(id, newDummy).then())
        .rejects
        .toThrow('ValidationError: name: Path `name` is required.')
    })
  })

  describe('delete', () => {
    it(`Should return a Dummy
        When delete works`, async () => {
      expect.assertions(2)
      const active = new DummyModel(new DummyBuilder().build())
      const id: mongoose.Types.ObjectId = await active.save().then((r: Dummy) => r._id)
      const result = await repository.delete(id).then()
      expect(result).toBeDefined()

      const findAll = await repository.findAll()
      expect(findAll.length).toBe(0)
    })

    it(`Should change updatedAt
        When delete works`, async () => {
      expect.assertions(1)
      const active = new DummyModel(new DummyBuilder().build())
      const oldDummy: Dummy = await active.save().then()
      const result = await repository.delete(oldDummy._id).then()
      // @ts-ignore
      expect(result.createdAt > oldDummy.createdAt).toBeDefined()
    })

    it(`Should return null
        When id doesn't exists`, async () => {
      expect.assertions(2)
      const active = new DummyModel(new DummyBuilder().build())
      await active.save().then((r: Dummy) => r._id)
      const result = await repository.delete(new mongoose.Types.ObjectId()).then()
      expect(result).toBeNull()

      const findAll = await repository.findAll()
      expect(findAll.length).toBe(1)
    })
  })
})
