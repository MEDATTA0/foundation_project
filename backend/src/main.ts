import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadGlobalMiddlewares, loadSecurity } from './middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    cors: { origin: '*', credentials: true },
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Foundation Project API')
    .setDescription('API documentation for the Foundation Project backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  loadSecurity(app);
  loadGlobalMiddlewares(app);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
