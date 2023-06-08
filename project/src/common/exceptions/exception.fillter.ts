import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFillter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const state = exception.getStatus();
    const err = exception.getResponse();

    if (typeof err === 'string') {
      res.status(state).json({
        statuscode: state,
        timestamp: new Date().toISOString(),
        path: req.url,
        error: err,
      });
    } else {
      res.status(state).json({
        statuscode: state,
        timestamp: new Date().toISOString(),
        path: req.url,
        ...err,
      });
    }
  }
}
