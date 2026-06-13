import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureApp(app: INestApplication) {
  const configService = app.get(ConfigService);
  const frontendOrigin = configService.getOrThrow<string>('FRONTEND_ORIGIN');

  app.enableCors({
    origin: [frontendOrigin],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: 'Validation failed',
          errors: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints ?? {},
          })),
        });
      },
    }),
  );
}
