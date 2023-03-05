import fs from 'node:fs'

export const createReadHTML =
	(filePath: string) =>
	(...arr: [RegExp | string, string][]) => {
		const data = fs.readFileSync(filePath, 'utf-8')
		let newHTML = data

		for (const [reg, value] of arr) {
			newHTML = newHTML.replace(reg, value)
		}

		return newHTML
	}
