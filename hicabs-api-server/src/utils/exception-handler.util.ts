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
    const additionalProperties: Record<string, any> = {};

    if (typeof response === 'object' && response !== null) {
      const responseObj = response as {
        message?: string | string[];
        errors?: any[];
        [key: string]: any;
      };

      if (typeof responseObj.message === 'string') {
        message = responseObj.message;
      } else if (Array.isArray(responseObj.message)) {
        errors = responseObj.message;
      }

      if (Array.isArray(responseObj.errors)) {
        errors = responseObj.errors;
      }

      for (const key in responseObj) {
        if (key !== 'message' && key !== 'errors') {
          additionalProperties[key] = responseObj[key];
        }
      }
    } else if (typeof response === 'string') {
      message = response;
    }

    throw new HttpException(
      { message, errors, ...additionalProperties },
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
