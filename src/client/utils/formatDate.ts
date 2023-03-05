import { format, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const formatDate = (date: string | Date, isLocalTime?: boolean) => {
	if (date instanceof Date) {
		date = date.toISOString()
	}

	const localDate = parseISO(date)

	const convertedDate = isLocalTime
		? localDate
		: utcToZonedTime(localDate, 'UTC')

	return isLocalTime
		? format(convertedDate, 'dd.MM.yy HH:mm:ss') // 12.05.21 11:40:04.9
		: format(convertedDate, 'dd.MM.yy HH:mm:ss') // 12.05.21 14:40:04.9

	// const milliseconds = getMilliseconds(localDate);
	// const firstDigit = Math.round((milliseconds + 100) / 100) - 1;

	// return isLocalTime
	//     ? `${format(convertedDate, "dd.MM.yy HH:mm:ss")}.${firstDigit}` // 12.05.21 11:40:04.9
	//     : `${format(convertedDate, "dd.MM.yy HH:mm:ss")}.${firstDigit}`; // 12.05.21 14:40:04.9
}
