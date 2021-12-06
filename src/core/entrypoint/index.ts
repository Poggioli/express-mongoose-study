/* eslint-disable no-new */
import {
  Controller, GroupItemsController, ItemsController, RolesController, UsersController
} from '@controllers'
import { Router } from 'express'

const router = Router()

const routes: Controller[] = [
  new ItemsController(router),
  new RolesController(router),
  new UsersController(router),
  new GroupItemsController(router)
]

routes.forEach((route) => {
  route.create()
})

export default router
