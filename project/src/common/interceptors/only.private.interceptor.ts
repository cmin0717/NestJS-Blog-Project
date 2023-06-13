import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class OnlyPrivateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user;
    const now = Date.now();
    if (user)
      return next.handle().pipe(
        map((data) => {
          return { success: true, data: data, now: now };
        }),
      );
    else throw new HttpException('인증에 문제가 있습니다!', 401);
  }
}
