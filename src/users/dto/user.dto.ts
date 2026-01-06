import { User } from '@prisma/client'
import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UserDto implements User {
	@IsString()
	@IsNotEmpty()
	id: string

	@IsString()
	@IsNotEmpty()
	name: string

	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, { message: "Too short! Must be at least 6 symbols long!" })
	password: string

	@IsDate()
	createdAt: Date

	@IsDate()
	updatedAt: Date
}