import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
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

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.error('No token provided')
      client.emit('error', { message: 'Auth required' })
      client.disconnect()

      return
    }

    const token = authHeader.substring(7)

    const payload = this.jwt.verify(token, {
      secret: this.config.getOrThrow('JWT_SECRET')
    })

    client.data.user = payload

    const userId = client.data.user.id

    if (!userId) {
      this.logger.error('No userId in token payload')
      client.disconnect()
      return
    }
    this.userSockets.set(userId, client.id)

    const userChats = await this.chatService.getChats(userId)
    userChats.forEach(chat => {
      client.join(`chat:${chat.id}`)
    })

    this.logger.log(`User ${userId} connected.`)
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user.id
    this.userSockets.delete(userId)

    this.logger.log(`User ${userId} disconnected.`)
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string, text: string }
  ) {
    const { chatId, text } = data
    const userId = client.data.user.id

    const message = await this.chatService.sendMessage(chatId, userId, text)
    client.emit('new_message', message)

    this.server.in(`chat:${chatId}`).emit('new_message', message)

    return message
  }


}
