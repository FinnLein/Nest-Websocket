import { Prisma } from '@prisma/client'

export const usersSelectOptions: Prisma.UserSelect = {
	id: true,
	name: true,
	email: true
}