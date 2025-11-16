import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { APIError, BetterAuthError } from 'better-auth';

@Catch(APIError)
export class CatchBetterAuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: APIError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    const { httpAdapter } = this.httpAdapterHost;
    const statusCode = exception.statusCode;
    const responseBody: {
      statusCode: number;
      message?: string;
      timestamp: string;
      path: string;
      stack?: string;
    } = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
    };

    responseBody.message = exception.message;
    if (process.env.NODE_ENV?.toLowerCase() !== 'production')
      responseBody.stack = exception.stack;
    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
