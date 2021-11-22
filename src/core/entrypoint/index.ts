import ItemsController from '@src/core/controllers'
import { Router } from 'express'

const router = Router()

ItemsController.create(router)

export default router
