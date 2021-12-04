import { Service } from '@services'
import { Router } from 'express'
import { Model } from 'mongoose'

export default class Controller {
  public _router: Router

  public _service: Service<any, any>

  public _model: Model<any>

  public _url: string

  constructor(router: Router, service: Service<any, any>, model: Model<any>) {
    this._router = router
    this._service = service
    this._model = model
    this._url = '/'.concat(this._model.collection.name)
    this.findAll()
    this.insert()
    this.findById()
    this.delete()
    this.update()
  }

  protected findAllHandlers(): any[] {
    return []
  }

  private findAll(): void {
    this._router.get(this._url, [
      ...this.findAllHandlers(),
      this._service.findAll()
    ])
  }

  protected findByIdHandlers(): any[] {
    return []
  }

  private findById(): void {
    this._router.get(this._url.concat('/:id'), [
      ...this.findByIdHandlers(),
      this._service.findById()
    ])
  }

  protected insertHandlers(): any[] {
    return []
  }

  private insert(): void {
    this._router.post(this._url, [
      ...this.insertHandlers(),
      this._service.insert()
    ])
  }

  protected deleteHandlers(): any[] {
    return []
  }

  private delete(): void {
    this._router.delete(this._url.concat('/:id'), [
      ...this.deleteHandlers(),
      this._service.delete()
    ])
  }

  protected updateHandlers(): any[] {
    return []
  }

  private update(): void {
    this._router.put(this._url.concat('/:id'), [
      ...this.updateHandlers(),
      this._service.update()
    ])
  }
}
