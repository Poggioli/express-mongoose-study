import { Item, ItemModel } from '@models'
import mongoose, { Model } from 'mongoose'

export default class ItemsRepository {
  private model: Model<Item>

  constructor() {
    this.model = ItemModel
  }

  public findAll = async (): Promise<Item[]> => this.model.find().then()

  public findById = async (id: mongoose.Types.ObjectId): Promise<Item | null> => this.model.findById(id).then()

  public insert = async (value: Item): Promise<mongoose.Types.ObjectId> => {
    const document: Item = new ItemModel(value)
    return document.save()
      .then((doc) => doc._id)
      .catch((er) => {
        throw new Error(er)
      })
  }

  public update = async (id: mongoose.Types.ObjectId, value: Item): Promise<Item | null> => {
    const options = { runValidators: true, new: true }
    return this.model.findByIdAndUpdate(id, value, options)
      .then()
      .catch((er) => {
        throw new Error(er)
      })
  }
}
