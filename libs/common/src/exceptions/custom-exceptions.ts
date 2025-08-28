import { HttpException, HttpStatus } from '@nestjs/common';

export class XRayProcessingException extends HttpException {
  constructor(message: string, cause?: any) {
    super(
      {
        message: 'X-Ray data processing failed',
        details: message,
        cause: cause?.message || cause,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string, cause?: any) {
    super(
      {
        message: 'Database operation failed',
        details: message,
        cause: cause?.message || cause,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class RabbitMQException extends HttpException {
  constructor(message: string, cause?: any) {
    super(
      {
        message: 'RabbitMQ operation failed',
        details: message,
        cause: cause?.message || cause,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(message: string, field?: string) {
    super(
      {
        message: 'Validation failed',
        details: message,
        field,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
