import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { usersSelectOptions } from './utils/users-select-options'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) { }

	async getAll() {
		return this.prisma.user.findMany({
			select: usersSelectOptions
		})
	}

	async getByName(name: string) {
		return this.prisma.user.findMany({
			where: {
				name
			},
			select: usersSelectOptions
		})
	}


	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			},
		})
	}

	async create(dto: CreateUserDto) {
		const { password, ...data } = dto

		return this.prisma.user.create({
			data: {
				...data,
				password: await hash(dto.password),
			}
		})
	}
}
