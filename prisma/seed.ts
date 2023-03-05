import { faker } from '@faker-js/faker'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

const createUser = async () => {
	const login = faker.internet.email()

	console.log({ login })

	const user = await prisma.user.create({
		data: { login },
	})

	return user
}

const createOperation = async (user: User) => {
	const status = faker.helpers.arrayElement(['fail', 'success', 'processing'])

	const flow = Array.from({ length: 10 }).map((_) =>
		faker.internet.domainWord()
	)

	const operation = await prisma.operation.create({
		data: {
			flow: faker.helpers.arrayElements(flow).join(' '),
			status: status,
			userId: user.id,
		},
	})

	if (status !== 'processing') {
		await prisma.subOperation.create({
			data: {
				id: operation.id,
				status: faker.helpers.arrayElement(['fail', 'success']),
			},
		})

		await prisma.subOperation2.create({
			data: {
				operationId: operation.id,
				status: faker.helpers.arrayElement(['fail', 'success']),
			},
		})
	}

	return operation
}

async function main() {
	const users: User[] = []

	for (let i = 0; i < 100; i++) {
		const user = await createUser()
		users.push(user)

		const len = faker.datatype.number({ min: 1, max: 100 })

		for (let j = 0; j < len; j++) {
			await createOperation(user)
		}
	}
}

main()
	.then(async () => {
		console.log('success')
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
