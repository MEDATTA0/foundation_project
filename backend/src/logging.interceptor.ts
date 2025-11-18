import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { catchError, Observable, tap, throwError } from 'rxjs';
import { handlePrismaExceptions } from './prisma.exceptions.filter';
import { APIError } from 'better-auth';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse();
    const { method, url } = req;
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => {
          const time = Date.now() - now;
          const statusCode = res.statusCode;
          this.logger.log(`${method} ${url} ${statusCode} - ${time}ms`);
        }),
      )
      .pipe(
        catchError((err: any) => {
          const time = Date.now() - now;
          let statusCode = 500;
          if (err instanceof PrismaClientKnownRequestError) {
            ({ statusCode } = handlePrismaExceptions(err));
          }
          if (err instanceof HttpException) statusCode = err.getStatus();
          if (err instanceof APIError) statusCode = err.statusCode;
          if (statusCode < 500)
            this.logger.warn(`${method} ${url} ${statusCode} - ${time}ms`);
          else
            this.logger.error(
              `${method} ${url} ${statusCode} - ${time}ms`,
              err.stack,
            );

          return throwError(() => err);
        }),
      );
  }
}
