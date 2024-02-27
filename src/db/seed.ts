/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker/locale/pt_BR'
import chalk from 'chalk'

import { db } from './connection'
import { restaurants, users } from './schema'

/**
 * Reset database
 */

await db.delete(users)
await db.delete(restaurants)

console.log(chalk.yellow('✔️ Database reset'))

/**
 * Create customers
 */

await db.insert(users).values([
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

console.log(chalk.yellow('✔️ Customers created'))

/**
 * Create manager
 */

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com.br',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.yellow('✔️ Manager created'))

/**
 * Create restaurants
 */

await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
])

console.log(chalk.yellow('✔️ Restaurant created'))

console.log(chalk.greenBright('✔️ Seed completed'))

process.exit()
