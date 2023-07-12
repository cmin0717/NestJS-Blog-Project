# 블로그 API 구현
* Swagger를 이용한 API 문서 작성
* JWT 토큰을 이용한 로그인 구현
* TypeORM를 이용하여 CRUD 구현

## 1. User 관련 API
![initial](https://github.com/cmin0717/NestJS-Blog-Project/assets/116286726/f9116dd6-3c46-4bdc-8ef8-6c1592af30b0)
* 회원가입시 class-validator 라이브러리를 이용하여 유효성 판단
* 로그인시 JWT 토큰을 이용하여 로그인 후 쿠키에 저장
* 로그아웃시 쿠키에 저장된 토큰값을 초기화

## 2. Blog 글 관련 API
(https://github.com/cmin0717/NestJS-Blog-Project/assets/116286726/6f2b53c8-bae9-49f8-bbd3-9e95cd8b9f4d)
* 가드 데코레이터를 사용하여 회원만 접근 가능
* User와 다대일 관계 형성
* Tag와 다대다 관계 형성
* Visitor와 일대다 괄계 형성

## 3. Tag 관련 API
(https://github.com/cmin0717/NestJS-Blog-Project/assets/116286726/50df45f6-9e75-4527-be89-0e68d872dce3)
* Blog와 다대다 관계 형성

## 4. Profile 관련 API
(https://github.com/cmin0717/NestJS-Blog-Project/assets/116286726/873fc987-75f9-4225-8def-6f7f14441842)
* User와 일대일 관계 형성

## 5. Visitor 관련 API
(https://github.com/cmin0717/NestJS-Blog-Project/assets/116286726/9bc97ae2-f98f-421e-98a3-d573418c78c6)
* Blog와 다대일 관계 형성