import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
	) { }

	async register(dto: RegisterDto) {
		const user = await this.findUserByEmail(dto.email)

		if (user) {
			throw new ConflictException('Name or email is already taken!')
		}

		const newUser = await this.prisma.user.create({
			data: {
				name: dto.name,
				email: dto.email,
				password: await hash(dto.password)
			}
		})

		const accessToken = await this.generateTokens(newUser.id, newUser.name)

		return accessToken
	}

	async login(dto: LoginDto) {
		const user = await this.findUserByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found!')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new BadRequestException('Invalid password!')

		const accessToken = await this.generateTokens(user.id, user.name)

		return accessToken
	}

	private async findUserByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			}
		})

		return user
	}

	private async generateTokens(id: string, name: string) {
		const payload = { sub: id, name }

		const accessToken = await this.jwt.signAsync(payload, {
			expiresIn: '15m'
		})

		return accessToken
	}

}
