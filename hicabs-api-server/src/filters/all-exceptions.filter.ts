import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorDetail {
  field?: string;
  constraints?: Record<string, string>;
  message?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      message: 'An error occurred',
      errors: [] as ErrorDetail[],
    };

    if (
      typeof message === 'object' &&
      message !== null &&
      'message' in message &&
      typeof message['message'] === 'string' &&
      'errors' in message &&
      Array.isArray(message['errors'])
    ) {
      // Handle validation errors
      errorResponse.message = message['message'];
      errorResponse.errors = message['errors'];
    } else if (typeof message === 'string') {
      // Handle custom errors
      errorResponse.errors.push({ message });
    } else {
      // Log unexpected error structure for debugging
      console.error('Unexpected error structure:', exception);
    }

    response.status(status).json(errorResponse);
  }
}
