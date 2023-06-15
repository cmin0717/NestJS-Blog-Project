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
      // jwt 추출 방법
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

// # Refresh Token
//  해커의 Access Token 탈취를 방지하기 위해서, Access Token 의 유효기간을 짧게 두고
//  Access Toekn 의 유효기간이 만료되었을 시, 다시 Access Toekn을 발행해주기 위해 검증하는 토큰을 Refresh Token이라 한다.
//  Access Token 은 다양한 정보를 담고 있으며, Refresh Token 은 재발급때 도움을 주는 짤막한 정보만 담아야 할 것이다

// 사용 과정
// 1. 로그인시 Access Toekn과 Refresh Token를 같이 발행하여 클라이언트로 전송한다.
// 2. Refresh Token은 서버 DB에서 user의 Refresh Token토큰 컬럼에 저장한다.
// 3. 유저는 Access Toekn을 사용하여 서버와 소통하다가 Access Toekn이 유효기간이 지나면 Refresh Token를 서버로 보낸다.
// 4. 여기서 사용자가 Access Toekn토큰도 없고 Refresh Token도 없다면 인증되지 못한 사용자이다.
// 5. 서버측에서는 받은 Refresh Token과 DB에 저장된 Refresh Token토큰을 비교하여 같다면 새로운 Access Toekn토큰을 발행해준다.
// 6. 만일 같지 않다면 인증되지 못한 사용자이다.
// 7. 로그아웃시에는 DB에 저장된 Refresh Token토큰 값을 지워준다.

// Access Token토큰의 탈취를 막기 위해 Refresh Token을 사용하는데 둘다 어차피 클라이언트 쿠키나 세션에 같이 있을텐데
// 그럼 같이 탈취되는거 아닌가??

// Refresh Token Rotation (RTR) 방법 - (One time Use Only)
// 그래서 찾아 보니 Refresh Token을 1회용으로 만들어 한번 재발급할때마다 Refresh Token도 새로운 값으로 바꾸는 방법이 있다고 한다.
// 근데 한번 탈취된다면 계속 탈취가 가능한거 아닐까?? 심오하다 심오해....
