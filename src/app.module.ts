import { ChatModule } from '@/modules/chat/chat.module'
import { UsersModule } from '@/modules/users/users.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		ChatModule,
		AuthModule,
		UsersModule
	],
	controllers: [],
	providers: []
})
export class AppModule { }
