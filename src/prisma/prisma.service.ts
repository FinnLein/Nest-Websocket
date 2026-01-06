import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(PrismaService.name)

	constructor(
		private readonly config: ConfigService,
	) {
		const pool = new PrismaPg({ connectionString: config.getOrThrow('DATABASE_URL') })
		super({ adapter: pool })
	}

	async onModuleInit() {
		try {
			this.logger.log('Starting Prisma connection.')
			await this.$connect()
			this.logger.log('Prisma connected.')
		} catch (error) {
			this.logger.error(`Cannot connect to Prisma: ${error}`)
		}
	}
	async onModuleDestroy() {
		try {
			this.logger.log('Closing Prisma connection.')
			await this.$disconnect()
			this.logger.log('Prisma connected.')
		} catch (error) {
			this.logger.error(`Cannot stop Prisma connection: ${error}`)
		}
	}
}
