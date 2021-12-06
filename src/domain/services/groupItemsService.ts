import { GroupItemsRepository } from '@repositories'
import { GroupItem } from '@models'
import Service from './service'

export default class GroupItemsService extends Service<GroupItem, GroupItemsRepository> {
  constructor() {
    super(new GroupItemsRepository())
  }

  protected mapperRequest(value: any): Partial<GroupItem> {
    return ({
      name: value.name,
      description: value.description,
      items: value.items
    })
  }
}
