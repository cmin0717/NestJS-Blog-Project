import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    if (req.user) return req.user;
    else return null;
  },
);
