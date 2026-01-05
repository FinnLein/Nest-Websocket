import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('by-name/:name')
  async getByName(@Param('name') name: string) {
    return this.usersService.getByName(name)
  }
  @Get('by-email/:email')
  async getByEmail(@Param('email') email: string) {
    return this.usersService.getByEmail(email)
  }
}
