import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { ChatService } from './chat.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { CreateChatDto } from './dto/create-chat.dto'
import { CreateMessageDto } from './dto/create-message.dto'

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

	@Get()
	@HttpCode(HttpStatus.OK)
	async getChats(@CurrentUser('id') userId: string) {
		return this.chatService.getChats(userId)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	async createChat(
		@Body() dto: CreateChatDto,
		@CurrentUser('id') userId: string
	) {
		return this.chatService.getOrCreate(userId, dto.participantId)
	}

	@Post("/:chatId/messages")
	@HttpCode(HttpStatus.OK)
	async sendMessage(
		@Body() dto: CreateMessageDto,
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: string
	) {
		return this.chatService.sendMessage(chatId, userId, dto.text)
	}

	@Get("/:chatId/messages")
	@HttpCode(HttpStatus.OK)
	async getMessages(
		@Param('chatId') chatId: string,
	) {
		return this.chatService.getMessages(chatId)
	}
}
