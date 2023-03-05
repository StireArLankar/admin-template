import { Link, RegisteredRoutesInfo } from '@tanstack/react-router'
import copy from 'copy-to-clipboard'
import { Copy } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { Button, buttonVariants } from '@/components/ui/Button'

type StyledLinkProps = {
	id: string | null | undefined
	to: RegisteredRoutesInfo['routePaths'] & `${string}/$id`
	display?: string
	className?: string
	wrapperClassName?: string

	canCopy?: boolean
}

const linkClass = tv({
	base: tw.text_link_base.font_mono.whitespace_nowrap,
})

const wrapperClass = tv({
	base: tw.p_1.text_center,
})

export const StyledLink = (props: StyledLinkProps) => {
	const canCopy = props.canCopy ?? true

	if (!props.id) {
		return null
	}

	const id = props.id

	const renderLink = () => (
		<Link
			to={props.to}
			params={{ id }}
			className={buttonVariants({
				variant: 'link',
				size: 'sm',
				className: linkClass({ className: props.className }),
			})}
		>
			{props.display ?? props.id}
		</Link>
	)

	if (!canCopy) {
		return (
			<div className={wrapperClass({ className: props.wrapperClassName })}>
				{renderLink()}
			</div>
		)
	}

	return (
		<div className={tw.flex.p_1.space_x_1}>
			<div className={tw.text_center.flex_1}>{renderLink()}</div>
			<Button
				variant='subtle'
				size='sm'
				className={tw.px_2.py_1}
				onClick={() => copy(id)}
			>
				<Copy transform='scale(0.9)' />
			</Button>
		</div>
	)
}
