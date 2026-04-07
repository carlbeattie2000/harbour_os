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

export class Forbidden extends AppError {
  constructor() {
    super('You do not have the correct permissions', 'E_NO_PERMS', 403)
  }
}
