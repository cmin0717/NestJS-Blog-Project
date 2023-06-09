import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { UsersRepository } from './user.repository';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    // jwt에서 사용할 모듈을 가져온다.
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1y' },
    }),
    // 해당 모듈에서 사용할 entitiy를 TypeOrmModule.forFeature([])안에 넣어준다.
    // 몽구스에서 스키마를 지정해주는것과 같은 느낌인듯 하다.
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtStrategy],
  exports: [UsersRepository],
})
export class UsersModule {}
