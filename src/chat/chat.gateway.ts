import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { ChatService } from './chat.service'

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) { }

  @SubscribeMessage('newMessage')
  handleMessage(@MessageBody() message: string) {
    console.log(message)
  }
}
