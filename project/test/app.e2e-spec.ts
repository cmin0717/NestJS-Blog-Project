import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // 테스트를 진행하기전에 가장 먼저 실행되는 함수(class의 constructor 같은 느낌)
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it은 하나의 테스트 단위(단락의 세부 단락)
  it('/ (GET)', () => {
    return (
      request(app.getHttpServer())
        // 요청할 엔드포인트
        .get('/')
        // 기대값 상태코드
        .expect(200)
        // 기대값 리턴값
        .expect('Hello World!')
    );
  });

  // describe는 테스트의 묶음 단위라고 생각하면 될듯하다.(목차의 단락)
  describe('어떤 테스트', () => {
    // test와 it은 같다 그냥 별칭만 다른것!
    test('2 + 2', () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe('/users - Test', () => {
    // 로그인을 하지 않고 요청
    test('/user (GET)', async () => {
      return await request(app.getHttpServer()).get('/users').expect(401);
    });

    // 회원가입
    test('/user (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        // send를 이용하여 데이터를 같이 보내줄수있다.
        .send({ email: 'test@test.com', password: 'test', username: 'test' });

      // return expect(res.statusCode).toBe(201);
      expect(res.statusCode).toBe(201); // 굳이 리턴하지 않아도 된다.

      // expect(res.body).toBe({...body값}) 하나의 테스트에서 여러개의 기대값을 원할수 있다.
    });

    // 로그인
    test('/users/login (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: 'test@test.com', password: 'test' });

      expect(res.statusCode).toBe(201);
    });
  });
});

// TDD (테스트 주도 개발) : 먼저 테스트 코드를 만들고 해당 테스트 코드를 통과하게끔 코드 개발하는 방식
// 테스트 실행 : npm run test:e2e
// import하는 모듈들을 상대 경로로 설정해주어야한다.
// 테스트용 db를 사용하는것도 나쁘지 않다.
// JEST 공식 문서를 참고 하자.
