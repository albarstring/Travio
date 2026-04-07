/**
 * Custom Application Exception
 * Digunakan untuk error handling yang lebih terstruktur
 */
export class AppException extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "AppException"
  }
}

export class ValidationException extends AppException {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationException"
  }
}

export class AuthenticationException extends AppException {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "AUTHENTICATION_ERROR")
    this.name = "AuthenticationException"
  }
}

export class AuthorizationException extends AppException {
  constructor(message: string = "Forbidden") {
    super(message, 403, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationException"
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND")
    this.name = "NotFoundException"
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, 409, "CONFLICT")
    this.name = "ConflictException"
  }
}
