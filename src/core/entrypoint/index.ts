import { ItemsController, UsersController } from '@src/core/controllers'
import { Router } from 'express'

const router = Router()

ItemsController.create(router)
UsersController.create(router)

export default router
