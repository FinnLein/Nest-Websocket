
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/config/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly config: ConfigService,
		private readonly prisma: PrismaService
	) {
		super({
			secretOrKey: config.getOrThrow('JWT_SECRET'),
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}
	async validate({ id }: Pick<User, 'id'>) {
		return this.prisma.user.findUnique({
			where: {
				id
			}
		})
	}
}