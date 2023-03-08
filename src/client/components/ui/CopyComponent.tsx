import { useCallback, useEffect, useState } from 'react'

import copy from 'copy-to-clipboard'
import { Check, Copy } from 'lucide-react'
import { tw } from 'typewind'

import { Button } from '@/components/ui/Button'

export const CopyComponent = ({ value }: { value: string }) => {
	const [hasCopied, setHasCopied] = useState(false)

	useEffect(() => {
		if (!hasCopied) {
			return
		}

		const timer = setTimeout(() => void setHasCopied(false), 500)

		return () => void clearTimeout(timer)
	}, [hasCopied])

	const copyToClipboard = useCallback(() => {
		if (value) {
			copy(value)
			setHasCopied(true)
		}
	}, [value])

	return (
		<Button
			variant='subtle'
			size='sm'
			className={tw.px_2.py_1.flex_1.grow_0}
			onClick={copyToClipboard}
		>
			{hasCopied ? (
				<Check
					className={tw.animate_in.duration_300.fade_in_0.zoom_in_50}
					transform='scale(0.9)'
				/>
			) : (
				<Copy
					className={tw.animate_in.duration_300.fade_in_0.zoom_in_50}
					transform='scale(0.9)'
				/>
			)}
		</Button>
	)
}
