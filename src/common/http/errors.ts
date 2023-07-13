export class HttpError<T = any> {
  readonly _tag: string = 'HttpError'
  readonly status: number = 0
  public body?: T

  constructor(body?: T) {
    this.body = body
  }
}

export class NotFound extends HttpError {
  readonly _tag = 'NotFound';
  readonly status = 404;
}

export class BadRequest extends HttpError {
  readonly _tag = 'BadRequest';
  readonly status = 400;
}

export class InternalServerError extends HttpError {
  readonly _tag = 'InternalServerError';
  readonly status = 500;
}