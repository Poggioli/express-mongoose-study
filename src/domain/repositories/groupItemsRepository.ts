import { GroupItem, GroupItemModel } from '@models'
import Repository from './repository'

export default class GroupItemsRepository extends Repository<GroupItem> {
  constructor() {
    super(GroupItemModel)
  }
}
