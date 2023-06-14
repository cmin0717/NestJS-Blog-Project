import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFillter } from './common/exceptions/exception.fillter';
import * as expressSession from 'express-session';
import * as expressBasicAuth from 'express-basic-auth';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

// 싱글톤 패턴으로 main구현
class Application {
  private logger = new Logger(Application.name);
  private mode: boolean;
  private port: string;
  private password: string;

  constructor(private server: NestExpressApplication) {
    this.server = server;

    if (!process.env.SECRET_KEY) {
      this.logger.error('시크릿 키가 없어용!');
    }
    this.mode = process.env.MODE === 'DEV' ? true : false;
    this.port = process.env.PORT;
    this.password = process.env.DB_PASSWORD;
  }

  // swagger 보안 설정(로그인)
  private setUpBasicAuth() {
    this.server.use(
      ['/docs', 'docs-json'],
      expressBasicAuth({
        challenge: true,
        users: { [process.env.DB_USERNAME]: this.password },
      }),
    );
  }

  // swagger 설정
  private setSwaggerMiddleware() {
    SwaggerModule.setup(
      'docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('Blog-Project')
          .setDescription('TypeORM-NEST')
          .setVersion('0.0.1')
          .build(),
      ),
    );
  }

  // 미들웨어 설정
  private async setUpMiddleware() {
    const app = this.server;

    // cors 설정
    app.enableCors({ origin: '*', credentials: true });

    // 쿠키를 사용하기 위한 미들웨어 설정
    app.use(cookieParser());

    // swagger 설정
    this.setUpBasicAuth();
    this.setSwaggerMiddleware();

    // 벨리데이터 설정
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    // passport에서 session을 사용하기 때문에 세션 설정을 해주어야한다.
    app.use(
      expressSession({
        secret: process.env.SECRET_KEY, // 세션 id 쿠키에 서명하는데 사용된다.
        resave: true, // 요청 중에 세션이 수정되지 않은 경우에도 세션이 세션 저장소에 다시 저장된다. (디폴트값 true)
        saveUninitialized: true, // 초기화되지 않은 세션을 강제로 저장소에 저장 (디폴트값 true)
      }),
    );

    // passport 설정
    app.use(passport.initialize()); // passport.initialize 미들웨어는 요청 (req 객체) 에 passport 설정
    app.use(passport.session()); // passport.session 미들웨어는 req.session 객체에 passport 인증 완료 정보를 저장

    // Exclude를 사용하기 위해 인터셉터를 설치
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    // 예외처리 필터 설정
    app.useGlobalFilters(new HttpExceptionFillter());
  }

  // 서버 실행 함수
  async bootstrap() {
    // 미들웨어 설정 후 해당 포트로 서버 오픈
    await this.setUpMiddleware();
    await this.server.listen(this.port);
  }

  startLog() {
    if (this.mode) {
      this.logger.log('DEV Server On!!');
    } else {
      this.logger.log('Product Server on!!');
    }
  }
}

async function init() {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.bootstrap();
  app.startLog();
}
init().catch((e) => {
  new Logger('init').error(e);
});
