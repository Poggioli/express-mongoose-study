/* eslint-disable no-new */
import { ItemsController, RolesController, UsersController } from '@src/core/controllers'
import { Router } from 'express'

const router = Router()

new ItemsController(router)
new RolesController(router)
new UsersController(router)

export default router
