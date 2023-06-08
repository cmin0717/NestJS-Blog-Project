import { HttpException, Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UserRegisterDto } from './dtos/user-register.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
}
