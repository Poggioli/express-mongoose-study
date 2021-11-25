import { User, UserModel } from '@src/core/models'
import Repository from './repository'

export default class UsersRepository extends Repository<User> {
  constructor() {
    super(UserModel)
  }

  public findByEmail = async (value: string): Promise<User | null> => UserModel.findByEmail(value).then()
}
