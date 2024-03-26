import chalk from 'chalk'
import { Elysia } from 'elysia'

import { approveOrder } from './routes/approve-order'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { cancelOrder } from './routes/cancel-order'
import { deliverOrder } from './routes/deliver-order'
import { dispatchOrder } from './routes/dispatch-order'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { getMonthCanceledOrdersAmount } from './routes/get-month-canceled-orders-amount'
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'
import { getMonthReceipt } from './routes/get-month-receipt'
import { getOrders } from './routes/get-orders'
import { getOrderDetails } from './routes/get-orders-details'
import { getProfile } from './routes/get-profile'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { signOut } from './routes/sign-out'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(cancelOrder)
  .use(getOrders)
  .use(getMonthReceipt)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status
        return error.toResponse()
      }
      case 'NOT_FOUND': {
        set.status = error.status
        return error.message
      }
      default: {
        set.status = 500
        console.error(error)

        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(3333, () => {
  console.log(chalk.bgRed.black('🔥 HTTP Server running on port 3333'))
})
