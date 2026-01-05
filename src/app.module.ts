import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ChatModule } from './chat/chat.module'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ChatModule,
		AuthModule,
		PrismaModule,
		UsersModule],
	controllers: [],
	providers: []
})
export class AppModule {}
