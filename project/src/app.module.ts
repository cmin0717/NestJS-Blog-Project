import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi'; // 환경변수 유효성 검사를 도와주는 패키지

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 환경 변수 유효성 체크
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DATABASE: Joi.string().required(),
      }),
    }),
    // mysql를 사용하기 위해 TypeOrmModule를 사용하여 db와 연결한다.
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [],
      synchronize: true, // 동기화 옵션
      autoLoadEntities: true,
      logging: true, // 로그 옵션 / 개발 환경에서만 사용하는것이 좋다.
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// npm install --save @nestjs/typeorm typeorm mysql2
