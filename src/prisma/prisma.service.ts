import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from 'src/generated/client/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(PrismaService.name)

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
