import AppError from './app_error.ts'

export class BaplieUploadError extends AppError {
  constructor() {
    super('Baplie file invalid', 'E_BAPLIE_FILE_INVALID', 400)
  }
}

export class VoyageNotFound extends AppError {
  constructor() {
    super('Voyage not found', 'E_VOYAGE_NOT_FOUND', 400)
  }
}

export class UnauthorisedAccessForVoyage extends AppError {
  constructor() {
    super(
      'You do not have permission to upload a stowage plan for this port call.',
      'E_BAPLIE_PORT_CALL_FORBIDDEN',
      403
    )
  }
}

export class PortCallCannotAcceptBaplieException extends AppError {
  constructor() {
    super(
      'You are unable to edit this port calls stowage plan.',
      'E_PORT_CALL_CANNOT_ACCEPT_BAPLIE',
      400
    )
  }
}
