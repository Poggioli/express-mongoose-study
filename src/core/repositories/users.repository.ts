import { User, UserModel } from '@src/core/models'
import mongoose, { Model } from 'mongoose'

export default class UsersRepository {
  private model: Model<User>

  constructor() {
    this.model = UserModel
  }

  public insert = async (value: User): Promise<mongoose.Types.ObjectId> => {
    const document: User = new UserModel(value)
    return document.save()
      .then((doc) => doc._id)
      .catch((err) => {
        throw new Error(err)
      })
  }
}
