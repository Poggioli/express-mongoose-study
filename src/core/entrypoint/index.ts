import ItemsController from '@controllers'
import { Router } from 'express'

const router = Router()

ItemsController.create(router)

export default router
