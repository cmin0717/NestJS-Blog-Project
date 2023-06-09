import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // canActivate 메소드는 인증에 성공했는지 실패 했는지 불린값으로 반환한다.
  // 인증되지 못하면 요청이 거부된다.
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // handleRequest 매서드는 인증에 통과했을경우 실행된다.
  // err매개변수는 사용하지 않아도 첫번째 인자로 받아야한다.
  handleRequest(err: any, user: any) {
    // 인증에 성공하면 user객체를 다음 차례로 리턴한다.
    return user;
  }
}
