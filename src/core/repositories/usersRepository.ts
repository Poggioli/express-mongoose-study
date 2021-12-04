import { User, UserModel } from '@models'
import Repository from './repository'

export default class UsersRepository extends Repository<User> {
  constructor() {
    super(UserModel)
  }

  public authenticate = async (value: User): Promise<User | null> => {
    const { email, password } = value
    return UserModel.findByEmail(email, '+password')
      .then((user: User | null) => (user?.matches(password) ? user : null))
  }
}
