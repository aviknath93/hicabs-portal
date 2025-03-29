import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { MulterError } from 'multer';
import { Response } from 'express';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'File upload error';

    // Use the exact message set in fileFilter if available
    if (exception.message) {
      message = exception.message;
    } else {
      switch (exception.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File too large. Max size is 3MB.';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Unexpected file field.';
          break;
      }
    }

    response.status(400).json({
      message,
      errors: [],
    });
  }
}
