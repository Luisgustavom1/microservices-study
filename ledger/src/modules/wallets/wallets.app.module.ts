import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from './wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'payments'),
        schema: configService.get<string>('DB_SCHEMA', 'wallets'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    WalletsModule,
  ],
})
export class WalletsAppModule {}
