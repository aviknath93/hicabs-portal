import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleException(error: unknown): never {
  if (error instanceof HttpException) {
    const response = error.getResponse?.();
    let message = 'An unexpected error occurred';
    let errors: any[] = [];

    if (typeof response === 'object' && response !== null) {
      const responseObj = response as {
        message?: string | string[];
        errors?: any[];
      };

      if (typeof responseObj.message === 'string') {
        message = responseObj.message;
      } else if (Array.isArray(responseObj.message)) {
        errors = responseObj.message;
      }

      if (Array.isArray(responseObj.errors)) {
        errors = responseObj.errors;
      }
    } else if (typeof response === 'string') {
      message = response;
    }

    throw new HttpException(
      { message, errors },
      error.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  if (error instanceof Error) {
    throw new HttpException(
      {
        message: error.message || 'An unexpected error occurred',
        errors: [],
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  throw new InternalServerErrorException({
    message: 'Something went wrong',
    errors: [],
  });
}
