import { PropsWithChildren, useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError } from '@trpc/client'
import { splitLink } from '@trpc/client/links/splitLink'
import { createWSClient, wsLink } from '@trpc/client/links/wsLink'
import {
	createTRPCReact,
	httpBatchLink,
	inferRouterProxyClient,
} from '@trpc/react-query'

import { basePath } from '@/global'
import { useAuthStore } from '@/store/auth'
import type { AppRouter } from '~/trpc'

export type entityRoutesKeys = Exclude<
	keyof inferRouterProxyClient<AppRouter>['admin'],
	'auth'
>

export const trpc = createTRPCReact<AppRouter>()

export function isTRPCClientError(
	cause: unknown
): cause is TRPCClientError<AppRouter> {
	return cause instanceof TRPCClientError
}

export default (props: PropsWithChildren<{}>) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				logger: { error: () => {}, log: () => {}, warn: () => {} },
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						retry: (failureCount, error) => {
							if (isTRPCClientError(error)) {
								if (error.data?.code === 'UNAUTHORIZED') {
									useAuthStore.getState().setAuth(null)
								}

								return false
							}

							if (failureCount < 2) {
								return true
							}

							return false
						},
					},
				},
			})
	)

	const [trpcClient] = useState(() => {
		const _httpLink = httpBatchLink({ url: 'api/trpc' })

		const wsLinkClient = (() => {
			if (typeof window === 'undefined') {
				return _httpLink
			}

			const host =
				process.env.NODE_ENV === 'production'
					? window.location.host
					: 'localhost:9001'

			const protocol = window.location.protocol.replace('http', 'ws')

			const _basePath = basePath.endsWith('/') ? basePath : basePath + '/'

			const url = protocol + '//' + host + _basePath + 'ws/socket'
			const client = createWSClient({ url })

			return wsLink({ client })
		})()

		return trpc.createClient({
			links: [
				// call subscriptions through websockets and the rest over http
				splitLink({
					condition: (op) => op.type === 'subscription',
					true: wsLinkClient,
					false: _httpLink,
				}),
			],
		})
	})

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</trpc.Provider>
	)
}
