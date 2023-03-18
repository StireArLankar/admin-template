import {
	Link,
	Outlet,
	RegisteredRoutesInfo,
	useMatches,
} from '@tanstack/react-router'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { ScrollArea } from '@/components/ui/ScrollArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

const tabsClasses = tv({
	slots: {
		root: tw.flex_1.flex.flex_col.min_h_0.basis_0,
		list: tw.self_start,
		content:
			tw.flex_1.flex.flex_col.min_h_0.basis_0.p_0.overflow_hidden
				.bg_primary_800,
	},
})()

// Our layout route
export default function RootComponent() {
	const routes = useMatches()

	const value = (() => {
		const val = routes[1]?.route.id as keyof RegisteredRoutesInfo['routesById']

		switch (val) {
			case '/layout/settings':
				return '.'
			case '/layout/settings/theme':
				return './theme'
			default:
				return '.'
		}
	})()

	return (
		<div className={tw.flex.flex_col.min_w_0.flex_1.p_2}>
			<Tabs value={value} className={tabsClasses.root()}>
				<div className={tw.flex.justify_between}>
					<TabsList className={tabsClasses.list()}>
						<TabsTrigger value='.' asChild>
							<Link from='/settings' to='.'>
								Info
							</Link>
						</TabsTrigger>

						<TabsTrigger value='./theme' asChild>
							<Link from='/settings' to='./theme'>
								Theme
							</Link>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value='.' className={tabsClasses.content()}>
					<ScrollArea
						noTable
						className={tw.max_w_full.flex_grow.basis_0.min_h_0}
					>
						<div className={tw.p_3}>hello world</div>
					</ScrollArea>
				</TabsContent>
				<TabsContent value='./theme' className={tabsClasses.content()}>
					<ScrollArea
						noTable
						className={tw.p_0.max_w_full.flex_grow.basis_0.min_h_0}
					>
						<Outlet />
					</ScrollArea>
				</TabsContent>
			</Tabs>
		</div>
	)
}
