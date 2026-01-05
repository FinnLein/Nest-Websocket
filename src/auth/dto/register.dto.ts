import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsEmail()
	email: string

	@MinLength(6, { message: 'Too short! Must be 6 symbols.' })
	@IsString()
	password: string
}