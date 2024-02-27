import chalk from 'chalk'
import { Elysia } from 'elysia'

import { registerRestaurant } from './routes/register-restaurant'

const app = new Elysia().use(registerRestaurant)

app.listen(3333, () => {
  console.log(chalk.bgRed.black('🔥 HTTP Server running on port 3333'))
})
