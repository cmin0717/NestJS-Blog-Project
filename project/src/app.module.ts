import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi'; // 환경변수 유효성 검사를 도와주는 패키지
import { UserEntity } from './users/users.entity';
import { BlogModule } from './blog/blog.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { VisitorModule } from './visitor/visitor.module';
import { ProfileEntity } from './profile/entities/profile.entity';
import { BlogEntity } from './blog/entities/blog.entity';
import { TagEntity } from './tag/entities/tag.entity';
import { VisitorEntity } from './visitor/entities/visitor.entity';
import { CommonEntity } from './common/entities/common.entity';

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
      entities: [
        UserEntity,
        ProfileEntity,
        BlogEntity,
        TagEntity,
        VisitorEntity,
      ],
      // synchronize에서 초기화가 되어야하는데 그렇게 작동하지 못하고 있다. 이유를 찾지 못해서
      // 그냥 처음실행할때 스키마를 던지고 새로 만드는 형태로 가보려고 한다.(개발용으로)
      // dropSchema를 사용하니 테스트 코드 실행시 문제가 발생한다. 어찌해야하오....
      // dropSchema: true,
      // 동기화 옵션 (매번 서버를 실행할때 해당 스키마를 기준으로 테이블을 만들기에 전에 있던 데이터에 손상이 갈수있다.)
      // 그렇기에 스키마를 만들때는 true로 해두고 계속 해당 테이블을 사용하기위해서는 false로 바꾸어 주어야한다.
      // synchronize: true,
      autoLoadEntities: true,
      logging: true, // 로그 옵션 / 개발 환경에서만 사용하는것이 좋다.
    }),
    UsersModule,
    BlogModule,
    ProfileModule,
    TagModule,
    VisitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// npm install --save @nestjs/typeorm typeorm mysql2
