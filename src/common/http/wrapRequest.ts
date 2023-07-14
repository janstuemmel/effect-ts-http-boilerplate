import * as Layer from '@effect/io/Layer';
import * as Effect from '@effect/io/Effect';
import * as C from '@effect/io/Config';
import { ConfigError } from '@effect/io/Config/Error';

import { pipe } from '@effect/data/Function';
import { Res, Req } from 'find-my-way';

import { AppRequest, AppResponse, PathParams, createAppResponse } from './http.js';
import { HttpError } from './errors.js';

export const wrapRequest = (
  di: Layer.Layer<never, ConfigError | HttpError, any>
) => (
  effect: (req: AppRequest) => Effect.Effect<unknown, HttpError, AppResponse>
) => async (
  _req: Req<any>,
  res: Res<any>,
  params: PathParams,
) => {
  const { status, body } = await Effect.runPromise(pipe(
    Effect.succeed({ path: params }),
    Effect.flatMap(effect),
    Effect.catchAll((err) => createAppResponse(err.body, err.status)),
    Effect.provideLayer(di),
    // in case of config error
    Effect.catchAll((err) => createAppResponse(undefined, 500))
  ));

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = status;
  res.end(typeof body === 'object' ? JSON.stringify(body) : body)
}
