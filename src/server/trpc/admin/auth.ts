import { TRPCError } from '@trpc/server'
import * as z from 'zod'

import { getConfig } from '~/config/config.actions'
import { t } from '~/trpc/context'

const loginSchema = z.object({ login: z.string(), password: z.string() })

export const adminAuthRouter = t.router({
	login: t.procedure
		.input(loginSchema)
		.output(z.enum(['admin', 'user']))
		.mutation(async ({ input, ctx }) => {
			const { login, password } = input

			const { users } = getConfig().devopsConfig

			const user = users.find(
				(item) => item.login === login && password === item.password
			)

			if (!user) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			ctx.req.session.user = user

			switch (user.role) {
				case 'admin':
					return 'admin'

				default:
					return 'user'
			}
		}),

	logout: t.procedure.mutation(({ ctx }) => {
		ctx.res.clearCookie('user_sid')
		ctx.req.session.user = undefined
		return 'ok'
	}),
})
