import { jwtExtractorFromCookie } from './../../common/utils/jwt.cookieparser';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookie]),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  //   async vaildate(payload: Payload) {}
}
