import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { type Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { TokensService } from './utils/tokens.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const accessToken = await this.authService.register(dto)

    this.tokensService.addTokenToResponse(accessToken, res)

    return { message: "Welcome!" }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginDto, @Res() res: Response) {
    const accessToken = await this.authService.login(dto)

    this.tokensService.addTokenToResponse(accessToken, res)

    return { message: "Welcome back!" }
  }
}
