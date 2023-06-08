import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { UserRegisterDto } from './dtos/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userentity: Repository<UserEntity>,
  ) {}

  async findUser(email: string) {
    try {
      const user = await this.userentity.exist({ where: { email } });
      return user;
    } catch (error) {
      throw new HttpException('DB 오류!', 400);
    }
  }

  async userCreate(info: UserRegisterDto): Promise<UserEntity> {
    try {
      return await this.userentity.save({ ...info });
    } catch (error) {
      throw new HttpException('DB 오류', 400);
    }
  }
}
