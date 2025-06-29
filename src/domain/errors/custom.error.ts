import { ErrorCode } from './';

export class CustomError extends Error {
  public readonly code: ErrorCode;

  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    code?: ErrorCode
  ) {
    super(message);
    // Si no se proporciona código, lo infiere del statusCode
    this.code = code || this.inferCodeFromStatus(statusCode);
  }

  private inferCodeFromStatus(statusCode: number): ErrorCode {
    switch (statusCode) {
      case 400:
        return ErrorCode.VALIDATION_ERROR;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.FORBIDDEN;
      case 404:
        return ErrorCode.NOT_FOUND;
      case 409:
        return ErrorCode.DUPLICATE_RESOURCE;
      case 500:
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }

  // Métodos estáticos actualizados
  static badRequest(message: string, code?: ErrorCode): CustomError {
    return new CustomError(400, message, code || ErrorCode.VALIDATION_ERROR);
  }

  static unauthorized(message: string): CustomError {
    return new CustomError(401, message, ErrorCode.UNAUTHORIZED);
  }

  static forbidden(message: string): CustomError {
    return new CustomError(403, message, ErrorCode.FORBIDDEN);
  }

  static notFound(message: string): CustomError {
    return new CustomError(404, message, ErrorCode.NOT_FOUND);
  }

  static conflict(message: string): CustomError {
    return new CustomError(409, message, ErrorCode.DUPLICATE_RESOURCE);
  }

  static internalServer(message: string = "Internal Server Error"): CustomError {
    return new CustomError(500, message, ErrorCode.INTERNAL_ERROR);
  }

  // Nuevos métodos para casos específicos
  static duplicateResource(message: string): CustomError {
    return new CustomError(409, message, ErrorCode.DUPLICATE_RESOURCE);
  }

  static validationError(message: string): CustomError {
    return new CustomError(400, message, ErrorCode.VALIDATION_ERROR);
  }
}
