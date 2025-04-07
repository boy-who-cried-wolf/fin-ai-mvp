import { registerAs } from '@nestjs/config';
import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class DatabaseConfig {
  @IsString()
  host: string;

  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;
}

class JwtConfig {
  @IsString()
  secret: string;

  @IsString()
  expiration: string;
}

class AiServiceConfig {
  @IsString()
  url: string;

  @IsNumber()
  @Type(() => Number)
  timeout: number;
}

class AppConfig {
  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  @IsOptional()
  environment?: string;
}

export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 8000,
    environment: process.env.NODE_ENV || 'development',
  },
  aiService: {
    url: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8080',
    timeout: parseInt(process.env.AI_SERVICE_TIMEOUT, 10) || 30000,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'fin_ai',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiration: process.env.JWT_EXPIRATION || '1d',
  },
}); 