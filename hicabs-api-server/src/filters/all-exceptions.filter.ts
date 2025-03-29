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

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An error occurred';
    const errors: ErrorDetail[] = [];

    // 1. If it's an HttpException (e.g., BadRequestException, PayloadTooLargeException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseContent = exception.getResponse();

      if (typeof responseContent === 'string') {
        message = responseContent;
        errors.push({ message: responseContent });
      } else if (
        typeof responseContent === 'object' &&
        responseContent !== null
      ) {
        const res = responseContent as any;

        // Validation errors or class-validator style
        if (Array.isArray(res.message)) {
          message = res.message[0];
          res.message.forEach((msg: string) => errors.push({ message: msg }));
        } else if (typeof res.message === 'string') {
          message = res.message;
          errors.push({ message: res.message });
        }

        // Multer and others might include `error` key
        if (res.error && !errors.length) {
          errors.push({ message: res.error });
          message = res.error;
        }
      }
    }

    // 2. If it's a normal JS Error (like thrown manually or multer raw error)
    else if (exception instanceof Error) {
      message = exception.message || message;
      errors.push({ message });
    }

    // 3. Log the unknown error structure
    else {
      console.error('⚠️ Unknown error structure:', exception);
    }

    response.status(status).json({
      message,
      errors,
    });
  }
}
