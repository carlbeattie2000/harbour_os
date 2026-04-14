import AppError from './app_error.ts'

export class AccountDoesNotOwnVessel extends AppError {
  constructor() {
    super(
      'You do not own this vessel. Please verify ownership first!',
      'E_VESSEL_NOT_OWNED_BY_ACCOUNT',
      400
    )
  }
}
