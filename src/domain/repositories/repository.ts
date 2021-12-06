import mongoose, {
  Document,
  FilterQuery, Model, Schema
} from 'mongoose'

export default class Repository<D extends Document> {
  protected _model: Model<D>

  constructor(_model: Model<D>) {
    this._model = _model
  }

  public findAll = async (): Promise<D[]> => this._model.find({ active: true } as FilterQuery<Schema>).then()

  public findById = async (id: mongoose.Types.ObjectId): Promise<D | null> => this._model
    .findOne({ _id: id, active: true } as FilterQuery<Schema>).then()

  public insert = async (value: D): Promise<mongoose.Types.ObjectId> => {
    const document = new this._model(value)
    return document.save()
      .then((doc: D) => doc._id)
      .catch((err: any) => {
        throw new Error(err)
      })
  }

  public update = async (id: mongoose.Types.ObjectId, value: D): Promise<D | null> => {
    const options = { runValidators: true, new: true }
    return this._model.findByIdAndUpdate(id, value as any, options)
      .then()
      .catch((er) => {
        throw new Error(er)
      })
  }

  public delete = async (id: mongoose.Types.ObjectId): Promise<D | null> => {
    const value = { active: false }
    const options = { new: true }
    return this._model.findByIdAndUpdate(id, value as any, options).then()
  }
}
