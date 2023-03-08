import { Link, RegisteredRoutesInfo } from '@tanstack/react-router'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { CopyComponent } from './ui/CopyComponent'

import { buttonVariants } from '@/components/ui/Button'

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
			<CopyComponent value={id} />
		</div>
	)
}
