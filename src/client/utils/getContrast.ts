import { colord, Colord } from 'colord'
import { extend } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'

extend([a11yPlugin])

export const getContrast = (color: Colord) => {
	let c = colord(color)

	let contrast = c.contrast(color)

	let count = 1

	while (count < 4 && contrast < 4.5) {
		c = colord(color).isLight() ? c.darken(0.4) : c.lighten(0.4)
		contrast = c.contrast(color)
		count++
	}

	return c
}
