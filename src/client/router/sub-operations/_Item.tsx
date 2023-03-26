import { memo, useState } from 'react'

import { useParams } from '@tanstack/react-router'
import { tw } from 'typewind'

import { DatePicker } from '@/components/ui/DatePicker'
import Tets from '@/components/ui/DatePickerV2'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { trpc } from '@/utils/trpc'

type Range = { start: number; end: number }

const Temp = memo(() => {
	const { id } = useParams({ from: '/layout/sub-operations/$id' })

	const { data } = trpc.admin.sub.item.useQuery(id)

	const [dateRange, setDateRange] = useState<Partial<Range>>()

	console.log({ dateRange })

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
				<div className={tw.p_2}>
					<div className={tw.w_max}>
						<DatePicker value={dateRange} onChange={setDateRange} />
					</div>
					{renderData()}
				</div>
				<div>
					<Tets />
				</div>
			</ScrollArea>
		</div>
	)
})

export default function Item() {
	return <Temp />
}
