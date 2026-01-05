import { Injectable } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class TokensService {
	public async addTokenToResponse(token: string, res: Response) {
		const expires = new Date()
		expires.setMinutes(expires.getMinutes() + 60)

		return res.cookie('accessToken', token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === "development" ? false : true,
			expires,
		})
	}
}