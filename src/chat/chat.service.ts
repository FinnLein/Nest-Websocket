import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { usersSelectOptions } from 'src/users/utils/users-select-options'

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService) { }

	async getOrCreate(user1Id: string, user2Id: string) {
		const existingChat = await this.getChat(user1Id, user2Id)

		if (existingChat) return existingChat

		const newChat = await this.createChat(user1Id, user2Id)

		return newChat
	}

	async sendMessage(chatId: string, senderId: string, text: string) {
		const message = await this.prisma.messages.create({
			data: {
				chatId,
				senderId,
				text
			},
			include: {
				sender: {
					select: usersSelectOptions
				},
				chat: true
			}
		})

		await this.prisma.chat.update({
			where: {
				id: chatId
			},
			data: {
				updatedAt: new Date()
			}
		})

		return message
	}

	async getMessages(chatId: string, page: number = 1, limit: number = 100) {
		const skip = (page - 1) * limit

		const messages = await this.prisma.messages.findMany({
			where: {
				chatId
			},
			include: {
				sender: {
					select: usersSelectOptions
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: limit,
			skip
		})

		return messages
	}

	async getChats(userId: string) {
		const chats = await this.prisma.chat.findMany({
			where: {
				participants: {
					some: { userId }
				}
			},
			include: {
				participants: {
					include: {
						user: {
							select: usersSelectOptions
						}
					},
					where: {
						userId: { not: userId }
					}
				},
				messages: {
					orderBy: { createdAt: 'desc' },
					take: 1
				}
			}
		})

		return chats
	}

	private async getChat(user1Id: string, user2Id: string) {
		return this.prisma.chat.findFirst({
			where: {
				AND: [
					{ participants: { some: { userId: user1Id } } },
					{ participants: { some: { userId: user2Id } } },
				]
			},
			include: {
				participants: {
					include: {
						user: {
							select: usersSelectOptions
						}
					}
				}
			}
		})
	}

	private async createChat(user1Id: string, user2Id: string) {
		return this.prisma.chat.create({
			data: {
				participants: {
					create: [
						{ userId: user1Id },
						{ userId: user2Id }
					]
				}
			},
			include: {
				participants: {
					include: {
						user: {
							select: usersSelectOptions
						}
					}
				}
			}
		})
	}


}
