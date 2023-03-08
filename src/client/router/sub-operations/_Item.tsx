import { memo } from 'react'

import { useParams } from '@tanstack/react-router'
import { tw } from 'typewind'

import { ScrollArea } from '@/components/ui/ScrollArea'
import { trpc } from '@/utils/trpc'

const Temp = memo(() => {
	const { id } = useParams({ from: '/layout/sub-operations/$id' })

	const { data } = trpc.admin.sub.item.useQuery(id)

	const renderData = () => {
		if (!data) {
			return null
		}

		return (
			<div>
				<div>{data.createdAt.toISOString()}</div>
			</div>
		)
	}

	return (
		<div className={tw.flex_1.flex.flex_col}>
			<ScrollArea
				style={{
					display: 'block',
					maxWidth: '100%',
					flexGrow: 1,
					flexBasis: 0,
					minHeight: 0,
				}}
			>
				<div className={tw.p_2}>{renderData()}</div>
			</ScrollArea>
		</div>
	)
})

export default function Item() {
	return <Temp />
}
