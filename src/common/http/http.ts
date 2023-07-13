import * as Effect from '@effect/io/Effect';

export type PathParams = { [k: string]: string | undefined };

export type AppRequest = {
  path: PathParams
}

export type AppResponse<T = unknown> = {
  status: number,
  body?: T,
}

export const createAppResponse = <T = unknown>(body: T | undefined, status = 200) => Effect.succeed({
  status,
  body,
})
