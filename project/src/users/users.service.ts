import { Response } from 'express';
import { HttpException, Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UserRegisterDto } from './dtos/user-register.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './users.entity';
import { userLogInDto } from './dtos/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: UserRegisterDto) {
    const { email, password } = body;
    const check = await this.usersRepository.findUser(email);

    if (check) throw new HttpException('중복된 이메일 입니다', 401);

    const hashPassWord = await bcrypt.hash(password, 10);
    const user: UserEntity = await this.usersRepository.userCreate({
      ...body,
      password: hashPassWord,
    });

    return user;
  }

  async logIn(body: userLogInDto, res: Response) {
    const { email, password } = body;

    const user = await this.usersRepository.findUser(email);

    if (!user) {
      throw new HttpException('존재하지 않는 이메일입니다.', 400);
    }

    const passwordCheck: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordCheck) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', 400);
    }
    try {
      const jwt = await this.jwtService.signAsync(
        { id: user.id },
        { secret: process.env.SECRET_KEY },
      );
      // 쿠키에 jwt 저장 // { httpOnly: true }옵션은 클라이언트에서 쿠키를 읽지 못하게 하는옵션이다.(보안 때문에)
      res.cookie('jwt', jwt, { httpOnly: true });
      return user;
    } catch (error) {
      throw new HttpException('jwt토큰 생성 오류', 400);
    }
  }
}

// 쿠키 옵션
// httpOnly: 이 속성이 true로 설정되면 클라이언트 측에서 쿠키를 읽을 수 없습니다. 이 속성은 보안을 위해 유용합니다.
// secure: 이 속성이 true로 설정되면 쿠키는 HTTPS 연결을 통해서만 전송됩니다. 이 속성은 보안을 위해 유용합니다.
// expires: 이 속성은 쿠키의 만료 날짜를 지정합니다. 쿠키의 만료 날짜가 지난 후에는 클라이언트는 쿠키를 받지 않습니다.
// maxAge: 이 속성은 쿠키의 최대 유효 기간을 지정합니다. 쿠키의 최대 유효 기간이 지난 후에는 클라이언트는 쿠키를 받지 않습니다.
