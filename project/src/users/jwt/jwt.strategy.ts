import { jwtExtractorFromCookie } from './../../common/utils/jwt.cookieparser';
import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { UsersRepository } from '../user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookie]),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.usersRepository.findUserId(payload.id);

    if (user) {
      return user;
    } else {
      throw new HttpException('접근 오류!', 400);
    }
  }
}
