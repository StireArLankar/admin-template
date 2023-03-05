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
				primary: {
					50: colors.indigo[900],
					100: colors.indigo[800],
					200: colors.indigo[700],
					300: colors.indigo[600],
					400: colors.indigo[500],
					500: colors.indigo[400],
					600: colors.indigo[300],
					700: colors.indigo[200],
					800: colors.indigo[100],
					900: colors.indigo[50],
					1000: colors.white,
					text: colors.black,
				},
			}),
			dark: dark({
				link: {
					active: colors.cyan[100],
					hover: colors.cyan[200],
					base: colors.cyan[300],
					contrast: colors.white,
				},
				primary: {
					...colors.slate,
					1000: colors.slate[900],
					text: colors.white,
				},
			}),
		})),
	],
}
