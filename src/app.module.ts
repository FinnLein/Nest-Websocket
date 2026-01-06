import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		ChatModule,
		AuthModule,
		PrismaModule,
		UsersModule
	],
	controllers: [],
	providers: []
})
export class AppModule { }
