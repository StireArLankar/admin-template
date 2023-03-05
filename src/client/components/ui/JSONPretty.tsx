import { useMemo } from 'react'

import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const classes = {
	main: tv({
		base: tw.bg_primary_800.text_primary_text.min_h_full.m_0.min_w_max
			.text_base,
	}),
	key: tv({ base: tw.text_amber_800.dark(tw.text_amber_500) }),
	string: tv({ base: tw.text_red_600.dark(tw.text_red_500) }),
	value: tv({ base: tw.text_green_600.dark(tw.text_green_500) }),
	boolean: tv({ base: tw.text_purple_600.dark(tw.text_purple_500) }),
}

type Theme = Partial<Record<keyof typeof classes, string | typeof tw.absolute>>

type IProps = {
	json: object
	space?: number
	theme?: Theme
}

export default function JSONPretty(props: IProps) {
	const { json, space = 2, theme = {} } = props

	const __html = useMemo(() => {
		return convertJsonToHMTL(json, space, theme)
	}, [json, space, theme])

	return (
		<div>
			<pre
				className={classes.main({ className: theme.main })}
				dangerouslySetInnerHTML={{ __html }}
			/>
		</div>
	)
}

const convertJsonToHMTL = (obj: object, space: number, theme: Theme) => {
	const regLine =
		/^( *)("[^"]+": )?(".*"|"[^"]*"|[\w.+-]*)?([,[{]|\[\s*\],?|\{\s*\},?)?$/gm

	const text = JSON.stringify(obj, null, space)

	if (!text) {
		return text
	}

	return text
		.replace(/&/g, '&amp;')
		.replace(/\\"([^,])/g, '\\&quot;$1')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(regLine, (_, ...args) =>
			replaceCapturedStringWithHtml(theme, ...args)
		)
}

const replaceCapturedStringWithHtml = (theme: Theme, ...args: string[]) => {
	const [ind = '', key, val, tra = ''] = args

	const spanEnd = '</span>'
	const keySpan = `<span class="${classes.key({ className: theme.key })}">`
	const valSpan = `<span class="${classes.value({
		className: theme.value,
	})}">`
	const strSpan = `<span class="${classes.string({
		className: theme.string,
	})}">`
	const booSpan = `<span class="${classes.boolean({
		className: theme.boolean,
	})}">`

	let sps = ind

	if (key) {
		sps = `${sps}"${keySpan}${key.replace(/^"|":\s$/g, '')}${spanEnd}": `
	}

	if (val) {
		if (val === 'true' || val === 'false') {
			sps = sps + booSpan + val + spanEnd
		} else {
			sps = sps + (val[0] === '"' ? strSpan : valSpan) + val + spanEnd
		}
	}

	return sps + tra
}
