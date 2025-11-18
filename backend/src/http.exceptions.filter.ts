import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class CatchHTTPExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    const { httpAdapter } = this.httpAdapterHost;
    let statusCode: number;
    let message: string;
    let stack: string | undefined;
    const responseBody: {
      message?: string;
      timestamp: string;
      path: string;
      stack?: string;
    } = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
    };
    // console.log('Came here');
    ({ statusCode, message, stack } = handleHttpExceptions(exception));
    // else ({ statusCode, message } = handleUnexpectedExceptions());
    responseBody.message = message;
    if (process.env.NODE_ENV?.toLowerCase() !== 'production')
      responseBody.stack = stack;
    return httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}

function handleHttpExceptions(exception: HttpException) {
  const res = exception.getResponse();
  let stack: string | undefined;
  const message =
    typeof res === 'string'
      ? res
      : (res as any)?.message || 'An error occurred';
  if (process.env.NODE_ENV?.toLowerCase() !== 'production')
    stack = exception.stack;
  return {
    statusCode: exception.getStatus(),
    message: String(message),
    stack,
  };
}
