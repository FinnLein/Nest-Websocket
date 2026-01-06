import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private userSockets = new Map<string, string>()
  private logger = new Logger(ChatGateway.name)

  constructor(
    private readonly chatService: ChatService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) { }

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)

      const payload = this.jwt.verify(token, {
        secret: this.config.getOrThrow('JWT_SECRET')
      })

      client.data.user = payload
    }

    const userId = client.data.user.sub
    this.userSockets.set(userId, client.id)

    const userChats = await this.chatService.getChats(userId)
    userChats.forEach(chat => {
      client.join(`chat:${chat.id}`)
    })

    this.logger.log(`User ${userId} connected.`)
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user.sub
    this.userSockets.delete(userId)

    this.logger.log(`User ${userId} disconnected.`)
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string, text: string }
  ) {
    const { chatId, text } = data
    const userId = client.data.user.sub
    
    const message = await this.chatService.sendMessage(chatId, userId, text)

    this.server.to(`chat:${data.chatId}`).emit('new_message', message)

    client.emit('message_sent', message.id)

    return message
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string
  ) {
    client.join(`chat:${chatId}`)
    return { message: "Welcome!" }
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string
  ) {
    client.leave(`chat:${chatId}`)
    return { message: "See you soon!" }
  }
}
