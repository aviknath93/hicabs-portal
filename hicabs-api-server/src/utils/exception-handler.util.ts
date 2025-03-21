import { HttpException, HttpStatus } from '@nestjs/common';

export function handleException(error: unknown): never {
  const customError = error as HttpException;
  const response = customError.getResponse();
  let message = 'An unexpected error occurred';
  let errors: any[] = [];

  if (typeof response === 'object' && response !== null) {
    const responseObj = response as { message?: string; errors?: any[] };
    if (typeof responseObj.message === 'string') {
      message = responseObj.message;
    }
    if (Array.isArray(responseObj.errors)) {
      errors = responseObj.errors;
    }
  }

  const errorResponse = {
    message,
    errors,
  };

  throw new HttpException(
    errorResponse,
    customError.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
