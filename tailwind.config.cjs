const { slate, slateDark, violetDark, violet } = require('@radix-ui/colors')
const colors = require('tailwindcss/colors')
const animate = require('tailwindcss-animate')
const { createThemes } = require('tw-colors')
const { typewindTransforms } = require('typewind/transform')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: {
		files: ['./src/**/*.{ts,tsx}'],
		transform: typewindTransforms,
	},
	darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		textDecorationThickness: {
			0: '0rem',
			1: '0.0625rem',
			2: '0.125rem',
			4: '0.25rem',
			8: '0.5rem',
		},
		outlineOffset: {
			0: '0rem',
			1: '0.0625rem',
			2: '0.125rem',
			4: '0.25rem',
			8: '0.5rem',
		},
		outlineWidth: {
			0: '0rem',
			1: '0.0625rem',
			2: '0.125rem',
			4: '0.25rem',
			8: '0.5rem',
		},
		textUnderlineOffset: {
			0: '0rem',
			1: '0.0625rem',
			2: '0.125rem',
			4: '0.25rem',
			8: '0.5rem',
		},
		borderWidth: {
			DEFAULT: '0.0625rem',
			0: '0rem',
			2: '0.125rem',
			4: '0.25rem',
			8: '0.5rem',
		},
		ringOffsetWidth: {
			0: '0rem',
			1: '0.0625rem',
			2: '0.125rem',
			4: '0.25rem',
			8: '0.5rem',
		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.5s ease-in',
				'accordion-up': 'accordion-up 0.5s ease-out',
			},
		},
	},
	plugins: [
		animate,
		createThemes(({ light, dark }) => ({
			light: light({
				link: {
					active: colors.cyan[900],
					hover: colors.cyan[800],
					base: colors.cyan[700],
					contrast: colors.black,
				},
				// primary: {
				//     50: colors.indigo[900],
				//     100: colors.indigo[800],
				//     200: colors.indigo[700],
				//     300: colors.indigo[600],
				//     400: colors.indigo[500],
				//     500: colors.indigo[400],
				//     600: colors.indigo[300],
				//     700: colors.indigo[200],
				//     800: colors.indigo[100],
				//     900: colors.indigo[50],
				// },
				// primary: {
				// 	50: colors.indigo[900],
				// 	100: colors.indigo[800],
				// 	200: colors.indigo[700],
				// 	300: colors.indigo[600],
				// 	400: colors.indigo[500],
				// 	500: colors.indigo[400],
				// 	600: colors.indigo[300],
				// 	700: colors.indigo[200],
				// 	800: colors.indigo[100],
				// 	900: colors.indigo[50],
				// 	1000: colors.white,
				// 	text: colors.black,
				// },
				primary: {
					50: violet.violet11,
					100: violet.violet10,
					200: violet.violet9,
					300: violet.violet8,
					400: violet.violet6,
					500: violet.violet5,
					600: violet.violet4,
					700: violet.violet3,
					800: violet.violet2,
					900: violet.violet1,
					1000: violet.violet1,
					text: violet.violet12,
				},
			}),
			dark: dark({
				link: {
					active: colors.cyan[100],
					hover: colors.cyan[200],
					base: colors.cyan[300],
					contrast: colors.white,
				},
				// primary: {
				// 	...colors.slate,
				// 	1000: colors.slate[900],
				// 	text: colors.white,
				// },
				primary: {
					// ...colors.slate,
					50: violetDark.violet11,
					100: violetDark.violet10,
					200: violetDark.violet9,
					300: violetDark.violet8,
					400: violetDark.violet6,
					500: violetDark.violet5,
					600: violetDark.violet4,
					700: violetDark.violet3,
					800: violetDark.violet2,
					900: violetDark.violet1,
					1000: violetDark.violet1,
					text: violetDark.violet12,
				},
			}),
		})),
	],
}
