import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class CatchPrismaExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
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

    ({ statusCode, message } = handlePrismaExceptions(exception));
    responseBody.message = message;
    if (process.env.NODE_ENV?.toLowerCase() !== 'production')
      responseBody.stack = stack;
    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}

export function handlePrismaExceptions(
  exception: PrismaClientKnownRequestError,
) {
  let statusCode = 500;
  let message = 'Internal server error';

  switch (exception.code) {
    case 'P2002': {
      const fields = (exception.meta?.target as string[]) || [];
      message = `Duplicate entry on unique field(s): ${fields.join(', ')}`;
      statusCode = 400;
      break;
    }
    case 'P2003': {
      const field = exception.meta?.field_name as string;
      message = `Foreign key constraint failed on field: ${field}`;
      statusCode = 400;
      break;
    }
    case 'P2025': {
      message = (exception.meta?.cause as string) || 'Record not found';
      statusCode = 404;
      break;
    }
    default: {
      console.error('Unhandled Prisma error:', exception);
    }
  }
  return { statusCode, message };
}
