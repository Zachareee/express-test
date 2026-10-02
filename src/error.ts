export class ClientError extends Error {
  private _statusCode: number

  get statusCode() {
    return this._statusCode
  }

  constructor(message: string, statusCode = 500) {
    super(message)
    this._statusCode = statusCode
  }
}
