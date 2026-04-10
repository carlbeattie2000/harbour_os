import AppError from "./app_error.ts";

export class UserNotPortalError extends AppError {
  constructor() {
    super('User must have the portal role to be attached to an account', 'E_USER_NOT_PORTAL', 400)
  }
}
