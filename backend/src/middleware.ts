import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import hpp from 'hpp';
import { CatchHTTPExceptionsFilter } from './http.exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
import { CatchPrismaExceptionsFilter } from './prisma.exceptions.filter';
import { CatchBetterAuthExceptionFilter } from './auth.exceptions.filter';
// import { doubleCsrf } from 'csrf-csrf';

export function loadSecurity(app: INestApplication) {
  // const whitelist = new Set([
  //   'http://localhost:3000',
  //   'http://localhost:3001',
  //   'http://localhost:5173',
  //   'http://localhost',
  // ]);
  // Security Middleware
  // const { doubleCsrfProtection } = doubleCsrf({});
  app.use(helmet());
  // app.use(doubleCsrfProtection);
  app.use(hpp());
}

export function loadGlobalMiddlewares(app: INestApplication) {
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(
    new CatchBetterAuthExceptionFilter(httpAdapter),
    new CatchHTTPExceptionsFilter(httpAdapter),
    new CatchPrismaExceptionsFilter(httpAdapter),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
