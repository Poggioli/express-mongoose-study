import { Order, OrderModel } from '@models'
import Repository from './repository'

export default class OrdersRepository extends Repository<Order> {
  constructor() {
    super(OrderModel)
  }
}
