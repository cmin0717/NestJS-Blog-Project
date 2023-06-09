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
      // 쿠키에 jwt 저장
      res.cookie('jwt', jwt, { httpOnly: true });
      return user;
    } catch (error) {
      throw new HttpException('jwt토큰 생성 오류', 400);
    }
  }
}
