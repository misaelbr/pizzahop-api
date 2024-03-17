/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker/locale/pt_BR'
import { createId } from '@paralleldrive/cuid2'
import chalk from 'chalk'

import { db } from './connection'
import {
  authLinks,
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from './schema'

/**
 * Reset database
 */

await db.delete(users)
await db.delete(restaurants)
await db.delete(orderItems)
await db.delete(products)
await db.delete(authLinks)

console.log(chalk.green('✔️ Database reset'))

/**
 * Create customers
 */

const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email().toLocaleLowerCase(),
      role: 'customer',
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email().toLocaleLowerCase(),
      role: 'customer',
    },
  ])
  .returning()

console.log(chalk.green('✔️ Customers created'))

/**
 * Create manager
 */

const [manager] = await db
  .insert(users)
  .values([
    {
      name: 'Misael Bandeira Silveira',
      email: 'admin@admin.com.br',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.green('✔️ Manager created'))

/**
 * Create restaurants
 */

const [restaurant1] = await db
  .insert(restaurants)
  .values([
    {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      managerId: manager.id,
    },
  ])
  .returning()

console.log(chalk.green('✔️ Restaurant created'))

/**
 * Create products
 */

function generateProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    priceInCents: Number(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
    restaurantId: restaurant1.id,
  }
}

const availableProducts = await db
  .insert(products)
  .values([
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
  ])
  .returning()

console.log(chalk.green('✔️ Products created'))

/**
 * Create orders
 */

type OrderItemsInsert = typeof orderItems.$inferInsert
type OrderInsert = typeof orders.$inferInsert

const orderItemsToInsert: OrderItemsInsert[] = []
const ordersToInsert: OrderInsert[] = []

for (let i = 0; i <= 200; i++) {
  const orderId = createId()

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 4,
  })

  let totalInCents = 0

  orderProducts.forEach((orderProduct) => {
    const quantity = faker.number.int({ min: 1, max: 4 })
    totalInCents += orderProduct.priceInCents * quantity

    orderItemsToInsert.push({
      orderId,
      priceInCents: orderProduct.priceInCents,
      productId: orderProduct.id,
      quantity,
    })
  })

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
    restaurantId: restaurant1.id,
    totalInCents,
    status: faker.helpers.arrayElement([
      'pending',
      'processing',
      'delivering',
      'delivered',
      'canceled',
    ]),
    createdAt: faker.date.recent({ days: 40 }),
  })
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToInsert)
console.log(chalk.blue('✔️ Seed completed'))

process.exit()
