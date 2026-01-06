import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	app.enableCors({
		origin: config.getOrThrow('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.use(cookieParser())

	await app.listen(config.get('APPLICATION_PORT') ?? 3000)
}
bootstrap()
