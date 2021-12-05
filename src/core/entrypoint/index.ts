/* eslint-disable no-new */
import {
  Controller, ItemsController, RolesController, UsersController
} from '@controllers'
import { Router } from 'express'

const router = Router()

const routes: Controller[] = [
  new ItemsController(router),
  new RolesController(router),
  new UsersController(router)
]

routes.forEach((route) => {
  route.create()
})

export default router
