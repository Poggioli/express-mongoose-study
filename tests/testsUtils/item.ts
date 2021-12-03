import { Item } from '../../src/core/models'

export default class ItemBuilder {
  private _name: string | undefined

  private _description: string | undefined

  private _price: number | undefined

  private _active: boolean

  constructor() {
    this._name = 'name'
    this._description = 'description'
    this._price = 1
    this._active = true
  }

  public name(name: string | undefined): ItemBuilder {
    this._name = name
    return this
  }

  public description(description: string | undefined): ItemBuilder {
    this._description = description
    return this
  }

  public price(price: number | undefined): ItemBuilder {
    this._price = price
    return this
  }

  public active(active: boolean): ItemBuilder {
    this._active = active
    return this
  }

  public build(): Item {
    return {
      name: this._name,
      description: this._description,
      price: this._price,
      active: this._active
    } as Item
  }
}
