import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.getAll()
  }

  @Get('by-name/:name')
  @HttpCode(HttpStatus.OK)
  async getByName(@Param('name') name: string) {
    return this.usersService.getByName(name)
  }
  @Get('by-email/:email')
  @HttpCode(HttpStatus.OK)
  async getByEmail(@Param('email') email: string) {
    return this.usersService.getByEmail(email)
  }
}
