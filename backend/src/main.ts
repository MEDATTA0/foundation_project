import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadGlobalMiddlewares, loadSecurity } from './middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    cors: { origin: '*', credentials: true },
  });

  loadSecurity(app);
  loadGlobalMiddlewares(app);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
