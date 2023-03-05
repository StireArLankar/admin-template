import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export const getPrismaClient = async () => {
	if (!prisma) {
		prisma = new PrismaClient()
	}

	return prisma
}
