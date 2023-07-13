import * as Layer from '@effect/io/Layer';
import * as Effect from '@effect/io/Effect';
import { pipe } from '@effect/data/Function';
import { Res, Req } from 'find-my-way';

import { AppRequest, AppResponse, PathParams, createAppResponse } from './http.js';
import { HttpError } from './errors.js';

export const wrapRequest = (
  di: Layer.Layer<never, never, any>
) => (
  effect: (req: AppRequest) => Effect.Effect<any, HttpError, AppResponse>
) => async (
  req: Req<any>,
  res: Res<any>,
  params: PathParams,
) => {
  const { status, body } = await Effect.runPromise(pipe(
    Effect.succeed({ path: params }),
    Effect.flatMap(effect),
    Effect.catchAll((err) => createAppResponse(err.body, err.status)),
    Effect.provideLayer(di),
  ));

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = status;
  res.end(typeof body === 'object' ? JSON.stringify(body) : body)
}
