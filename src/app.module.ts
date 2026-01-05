import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ChatModule } from './chat/chat.module'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ChatModule,
		AuthModule,
		PrismaModule],
	controllers: [],
	providers: []
})
export class AppModule {}
