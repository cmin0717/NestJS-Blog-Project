import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFillter } from './common/exceptions/exception.fillter';
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
          .setTitle('Blog-API')
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

    // passport 설정
    app.use(passport.initialize()); // passport.initialize 미들웨어는 요청 (req 객체) 에 passport 설정
    app.use(passport.session()); // passport.session 미들웨어는 req.session 객체에 passport 인증 완료 정보를 저장

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
