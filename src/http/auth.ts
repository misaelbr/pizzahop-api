import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
import { Elysia, type Static, t } from 'elysia'

import { env } from '../env'

export const jtwPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jtwPayload,
    }),
  )
  .use(cookie())
  .derive(({ jwt, setCookie, removeCookie }) => {
    return {
      signUser: async (payload: Static<typeof jtwPayload>) => {
        const token = await jwt.sign(payload)

        setCookie('auth', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
      },
      signOut: () => {
        removeCookie('auth')
      },
    }
  })
