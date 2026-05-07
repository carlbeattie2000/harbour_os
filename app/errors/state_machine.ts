import AppError from './app_error.ts'

export class InvalidStateTransitionException extends AppError {
  constructor() {
    super('This action cannot be performed.', 'E_INVALID_STATE_TRANSITION', 409)
  }
}
