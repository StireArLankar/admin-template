export const zeroPad = (num: number) => String(num).padStart(2, '0')

export const getFormattedDuration = (remaining: number, secs?: true) => {
	const divider = secs ? 1 : 1000
	const secondsNum = Math.floor((remaining / divider) % 60)
	const minutesNum = Math.floor((remaining / (divider * 60)) % 60)
	const hoursNum = Math.floor((remaining / (divider * 60 * 60)) % 24)
	const days = Math.floor(remaining / (divider * 60 * 60 * 24)).toString()

	const hours = zeroPad(hoursNum)
	const minutes = zeroPad(minutesNum)
	const seconds = zeroPad(secondsNum)

	return { days, hours, minutes, seconds }
}
