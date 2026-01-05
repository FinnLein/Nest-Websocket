import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, {message: "Too short! Must be at least 6 symbols long!"})
	password: string
}