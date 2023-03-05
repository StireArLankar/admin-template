import store from 'store2'
import { z } from 'zod'

export const baseSearchSchema = z.object({
	pageIndex: z.number().catch(0),
	pageSize: z.number().catch(() => {
		const val = store.get('pageSize')

		if (!val) {
			return 20
		}

		if (isNaN(+val)) {
			return 20
		}

		return +val
	}),
})
