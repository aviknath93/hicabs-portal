import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter'; // Import the custom exception filter
import { rateLimitConfig } from './config/rate-limit.config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       directives: {
  //         defaultSrc: [`'self'`],
  //         styleSrc: [`'self'`, `'unsafe-inline'`],
  //         imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
  //         scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
  //       },
  //     },
  //   }),
  // );

  app.use(helmet());

  app.use(rateLimitConfig);

  // Enable CORS
  app.enableCors();

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            message: 'Validation failed',
            errors: errors.map((error) => ({
              field: error.property,
              constraints: error.constraints,
            })),
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  // Apply the custom exception filter globally
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HiCabs-portal API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // name of the security scheme
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
