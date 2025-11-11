import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(Error)
export class AnyExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const { httpAdapter } = this.httpAdapterHost;
    const responseBody: {
      message?: string;
      timestamp: string;
      path: string;
      stack?: string;
    } = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
    };

    responseBody.message = 'Something went wrong. Please try later!';
    if (process.env.NODE_ENV?.toLowerCase() !== 'production')
      responseBody.stack = exception?.stack;
    httpAdapter.reply(ctx.getResponse(), responseBody, 500);
  }
}
