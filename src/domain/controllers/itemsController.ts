import { ItemsService } from '@services'
import { jwtValidator } from '@src/core/auth'
import { ItemModel } from '@models'
import { Router } from 'express'
import Controller from './controller'

export default class ItemsController extends Controller {
  constructor(router: Router) {
    super(router, new ItemsService(), ItemModel)
  }

  protected insertHandlers(): any[] {
    return [jwtValidator()]
  }

  protected deleteHandlers(): any[] {
    return [jwtValidator()]
  }

  protected updateHandlers(): any[] {
    return [jwtValidator()]
  }
}
