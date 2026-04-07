import AppError from './app_error.ts'

export class ISO6346CheckDigitInvalid extends AppError {
  constructor() {
    super('Check digit is invalid.', 'E_ISO6346_CHECK_DIGIT_INVALID', 400)
  }
}

export class ISO6346MustBeString extends AppError {
  constructor() {
    super('The container code must be a string', 'E_ISO6346_MUST_BE_STRING', 400)
  }
}

export class ISO6346InvalidLength extends AppError {
  constructor() {
    super('The container code must be 11 characters long', 'E_ISO6346_INVALID_LENGTH', 400)
  }
}

export class ISO6346InvalidFormat extends AppError {
  constructor() {
    super('Invalid code format', 'E_ISO6346_INVALID_FORMAT', 400)
  }
}

export class ISO6346InvalidCharacterInCode extends AppError {
  constructor() {
    super('Invalid character in container code', 'E_ISO6346_INVALID_CHARACTER', 400)
  }
}

export class ISO6346InvalidTypeCode extends AppError {
  constructor() {
    super('Invalid type code.', 'E_ISO6346_INVALID_TYPE_CODE', 400)
  }
}

export class ISO6346InvalidSizeTypeCode extends AppError {
  constructor() {
    super('Invalid size type code.', 'E_ISO6346_INVALID_SIZE_TYPE_CODE', 400)
  }
}
