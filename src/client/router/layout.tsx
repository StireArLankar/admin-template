import { memo, useEffect, useState } from 'react'

import { Link, Outlet, Route, useRouter } from '@tanstack/react-router'
import { LogOut, Music, Sidebar } from 'lucide-react'
import { tv } from 'tailwind-variants'
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

		<Link
			to='/settings'
			inactiveProps={inactiveProps1}
			activeProps={activeProps1}
		>
			Settings
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
			<LogOut className={tw.w_4.h_4} />
		</Button>
	)
})

const sidebar = tv({
	base: tw.flex_col.flex.w_full.transition_transform.bottom_0.top_0
		.sm(tw.transform_none.z_auto.border_r_2.border_primary_400.transition_none)
		.important(tw.absolute)
		.sm(tw.important(tw.relative)).bg_primary_900.z_50,

	variants: {
		open: {
			true: tw.translate_x_0,
			false: tw.translate_x_['-100%'],
		},
	},
})

const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const zxc = useRouter()

	useEffect(() => {
		return zxc.__store.subscribe((state) => {
			if (state.currentLocation !== state.latestLocation) {
				setIsSidebarOpen(false)
			}
		})
	}, [zxc.__store])

	return (
		<>
			<div className={tw.gap_2.p_2.flex.justify_end}>
				<Button
					variant='outline'
					className={tw.sm(tw.hidden).mr_auto}
					onClick={() => setIsSidebarOpen((prev) => !prev)}
				>
					<Sidebar className={tw.w_4.h_4} />
				</Button>

				<ThemeToggle />
				<LogOutButton />
			</div>

			<hr className={tw.border_primary_400} />

			<div
				className={tw.min_h_0.flex_1.grid.relative.h_full.sm(
					tw.grid_cols_['230px_1fr']
				)}
			>
				<ScrollArea className={sidebar({ open: isSidebarOpen })}>
					<div className={tw.flex.flex_col}>
						<aside className={tw.pb_12}>
							<div className='px-6 py-4'>
								<p className='flex items-center text-2xl font-semibold tracking-tight'>
									<Music className={tw.w_6.h_6.mr_2} />
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
	)
}

// Our layout route
export const layoutRoute = new Route({
	getParentRoute: () => rootRoute,
	id: 'layout',
	component: Layout,
})
