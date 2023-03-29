import { memo } from 'react'

import {
	Link,
	RegisteredRoutesInfo,
	useMatches,
	useParams,
} from '@tanstack/react-router'
import { inferRouterOutputs } from '@trpc/server'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { StyledLink } from '@/components/StyledLink'
import JSONPretty from '@/components/ui/JSONPretty'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { stringToTWBgColor } from '@/utils/stringToColor'
import { trpc } from '@/utils/trpc'
import type { AppRouter } from '~/trpc'

export type Data = inferRouterOutputs<AppRouter>['admin']['operations']['item']

const tabsClasses = tv({
	slots: {
		root: tw.flex_1.flex.flex_col.min_h_0.basis_0,
		list: tw.self_start,
		content:
			tw.flex_1.flex.flex_col.min_h_0.basis_0.p_0.overflow_hidden
				.bg_primary_800,
	},
})()

const statusClass = tv({
	base: tw.px_3.py_2.rounded_md.text_center.text_lg.border,
	variants: {
		status: {
			fail: tw.important(tw.bg_red_400$[40].border_red_400),
			success: tw.important(tw.bg_green_400$[40].border_green_400),
			processing: tw.important(tw.bg_blue_400$[40].border_blue_400),
		},
	},
})

const cardClass = tv({
	base: tw.border.bg_primary_1000.bg_opacity_50.border_primary_900.rounded_md
		.max_h_['300px'].overflow_hidden.rounded_md.h_full,

	variants: {
		status: {
			fail: tw.important(tw.bg_red_400$[40].border_red_400),
			success: tw.important(tw.bg_green_400$[40].border_green_400),
		},
	},
})

const Temp = memo(() => {
	const { id } = useParams({ from: '/layout/operations/$id' })

	const { data } = trpc.admin.operations.item.useQuery(id)

	const routes = useMatches()

	const value = (() => {
		const val = routes[1]?.route.id as keyof RegisteredRoutesInfo['routesById']

		switch (val) {
			case '/layout/operations/$id/':
				return '.'
			case '/layout/operations/$id/json':
				return './json'
			default:
				return '.'
		}
	})()

	const renderData = () => {
		if (!data) {
			return null
		}

		return (
			<div className={tw.flex.flex_col.flex_1.p_2}>
				<h1
					className={
						tw.text_xl.font_bold.text_primary_300.text_ellipsis.overflow_hidden
							.whitespace_nowrap
					}
				>
					Operation #{data.id}
				</h1>

				<ScrollArea style={{ maxHeight: `6.6rem` }}>
					<div className={tw.flex.pb_2.gap_2.mt_1.sm(tw.flex_wrap)}>
						{data.flow.split(' ').map((item, index, arr) => (
							<span
								className={
									tw.px_1.py_[0.5].text_sm.rounded_md.bg_opacity_40
										.text_primary_text.whitespace_nowrap
								}
								style={{
									backgroundColor: stringToTWBgColor(item),
									fontWeight: arr.length - 1 === index ? 'bold' : 'normal',
									opacity: arr.length - 1 === index ? 1 : 0.8,
								}}
								key={index}
							>
								{item}
							</span>
						))}
					</div>
				</ScrollArea>

				<hr className={tw.border_primary_400.mb_2} />

				<Tabs value={value} className={tabsClasses.root()}>
					<div className={tw.flex.justify_between}>
						<TabsList className={tabsClasses.list()}>
							<TabsTrigger value='.' asChild>
								<Link from='/operations/$id' to='.'>
									Info
								</Link>
							</TabsTrigger>
							<TabsTrigger value='./json' asChild>
								<Link from='/operations/$id' to='./json'>
									JSON
								</Link>
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value='.' className={tabsClasses.content()}>
						<ScrollArea
							noTable
							className={tw.max_w_full.flex_grow.basis_0.min_h_0}
						>
							<div className={tw.p_3}>
								<div className={statusClass({ status: data.status as any })}>
									{data.status}
								</div>

								<div
									className={tw.grid.gap_2.mt_2}
									style={{
										gridTemplateColumns:
											'repeat(auto-fill, minmax(300px, 1fr))',
									}}
								>
									<SubOperationCard data={data.subOperation} />
									<SubOperation2Card data={data.subOperation2} />
								</div>
							</div>
						</ScrollArea>
					</TabsContent>
					<TabsContent value='./json' className={tabsClasses.content()}>
						<ScrollArea className={tw.p_0.max_w_full.flex_grow.basis_0.min_h_0}>
							<JSONPretty theme={{ main: tw.p_1 }} json={data ?? {}} />
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</div>
		)
	}

	return <div className={tw.flex_1.flex.flex_col}>{renderData()}</div>
})

export default function Item() {
	return <Temp />
}

const SubOperation2Card = (props: { data?: Data['subOperation2'] }) => {
	if (!props.data) {
		return null
	}

	return (
		<ScrollArea
			className={cardClass({
				status: props.data.status === 'success' ? 'success' : 'fail',
			})}
		>
			<div className={tw.p_2}>
				<div className={tw.font_bold}>subOperation2</div>
				<StyledLink
					canCopy={false}
					wrapperClassName={tw.text_left.px_0}
					className={tw.px_0}
					to='/sub-operations/$id'
					id={props.data.id}
				/>
				<div className={tw.overflow_hidden.rounded_md}>
					<JSONPretty json={props.data} theme={{ main: tw.p_1 }} />
				</div>
			</div>
		</ScrollArea>
	)
}

const SubOperationCard = (props: { data?: Data['subOperation'] }) => {
	if (!props.data) {
		return null
	}

	return (
		<ScrollArea
			className={cardClass({
				status: props.data.status === 'success' ? 'success' : 'fail',
			})}
		>
			<div className={tw.p_2}>
				<div className={tw.font_bold}>subOperation</div>

				<StyledLink
					canCopy={false}
					wrapperClassName={tw.text_left.px_0}
					className={tw.px_0}
					to='/sub-operations/$id'
					id={props.data.id}
				/>
				<div className={tw.overflow_hidden.rounded_md}>
					<JSONPretty json={props.data} theme={{ main: tw.p_1 }} />
				</div>
			</div>
		</ScrollArea>
	)
}
