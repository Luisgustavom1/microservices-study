import { NestFactory } from '@nestjs/core';
import { WalletsAppModule } from './wallets.app.module';

async function bootstrap() {
  const app = await NestFactory.create(WalletsAppModule);
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
