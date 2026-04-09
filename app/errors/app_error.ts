export default class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor() {
    super('Not found', 'E_NOT_FOUND', 404)
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super('You do not have the correct permissions', 'E_NO_PERMS', 403)
  }
}
