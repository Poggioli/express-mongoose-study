import { User, UserModel } from '@src/core/models'
import Repository from './repository'

export default class UsersRepository extends Repository<User> {
  constructor() {
    super(UserModel)
  }

  public findByEmail = async (value: string, projection?: string): Promise<User | null> => UserModel.findByEmail(value, projection).then()

  public authenticate = async (value: User): Promise<boolean> => {
    const { email, password } = value
    return UserModel.findByEmail(email, '+password')
      .then((user: User | null) => !!user && user.matches(password))
  }
}
