import { memo } from 'react'

import { Link, Outlet, Route } from '@tanstack/react-router'
import { LogOut, Music } from 'lucide-react'
import { tw } from 'typewind'

import { rootRoute } from './rootRoute'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Button, buttonVariants } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useAuthStore } from '@/store/auth'
import { trpc } from '@/utils/trpc'

const inactiveProps1 = {
	className: buttonVariants({
		variant: 'outline',
		size: 'sm',
		className: 'w-full justify-start',
	}),
}

const activeProps1 = {
	className: buttonVariants({
		variant: 'subtle',
		size: 'sm',
		className: 'w-full justify-start',
	}),
}

const Links = () => (
	<div className='space-y-2'>
		<Link
			to='/operations'
			inactiveProps={inactiveProps1}
			activeProps={activeProps1}
			activeOptions={{ exact: true }}
		>
			Operations
		</Link>

		<Link
			to='/sub-operations'
			inactiveProps={inactiveProps1}
			activeProps={activeProps1}
			activeOptions={{ exact: true }}
		>
			Sub Operations
		</Link>
	</div>
)

const LogOutButton = memo(() => {
	const { mutateAsync, isLoading } = trpc.admin.auth.logout.useMutation()
	const { setAuth } = useAuthStore()

	return (
		<Button
			variant='outline'
			disabled={isLoading}
			onClick={async () => {
				if (isLoading) {
					return
				}

				await mutateAsync()
				setAuth(null)
			}}
		>
			<LogOut />
		</Button>
	)
})

// Our layout route
export const layoutRoute = new Route({
	getParentRoute: () => rootRoute,
	id: 'layout',
	component: () => (
		<>
			<div
				className={tw.self_end.gap_2.p_2.grid.grid_flow_col.auto_cols_max.hover(
					tw.auto_cols_min
				)}
			>
				<ThemeToggle />
				<LogOutButton />
			</div>

			<hr className={tw.border_primary_400} />

			<div className={tw.min_h_0.flex_1.grid.h_full.grid_cols_['230px_1fr']}>
				<ScrollArea className={tw.flex_col.flex.border_r_2.border_primary_400}>
					<div className={tw.flex.flex_col}>
						<aside className={tw.pb_12}>
							<div className='px-6 py-4'>
								<p className='flex items-center text-2xl font-semibold tracking-tight'>
									<Music className='mr-2' />
									Menu
								</p>
							</div>

							<div className='space-y-4'>
								<div className={tw.px_4.pb_2}>
									<h2 className='pb-2 px-2 text-lg font-semibold tracking-tight'>
										Submenu
									</h2>

									<Links />
								</div>
							</div>
						</aside>
					</div>
				</ScrollArea>

				<div className={tw.flex.flex_col.min_w_0}>
					<Outlet />
				</div>
			</div>
		</>
	),
})
