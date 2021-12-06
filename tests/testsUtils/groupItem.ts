import mongoose from 'mongoose'
import { GroupItem } from '../../src/domain/models'

export default class GroupItemRepository {
  private _name: string | undefined = 'name'

  private _description: string | undefined = 'description'

  private _items: mongoose.Types.ObjectId[] | undefined = [new mongoose.Types.ObjectId()]

  public name(name: string | undefined): GroupItemRepository {
    this._name = name
    return this
  }

  public description(description: string | undefined): GroupItemRepository {
    this._description = description
    return this
  }

  public items(items: mongoose.Types.ObjectId[] | undefined): GroupItemRepository {
    this._items = items
    return this
  }

  public build(): GroupItem {
    return {
      name: this._name,
      description: this._description,
      items: this._items
    } as GroupItem
  }
}
