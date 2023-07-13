import { it, expect } from 'vitest';

import * as Effect from '@effect/io/Effect';
import * as Layer from '@effect/io/Layer';
import { pipe } from '@effect/data/Function';

import { Config } from '../common/config/config.js';
import { TodoClientLayer } from '../common/client/todoClient.js';
import { validateRequest, getTodoHandler } from './handler.js';

import stageConfig from '../../config/stage.js';

const config = Layer.succeed(
  Config,
  Config.of(stageConfig)
);

const di = pipe(
  config,
  Layer.provide(TodoClientLayer),
);

it('request success', async () => {
  const handler = getTodoHandler({ path: { id: '1' } })
  const runnable = Effect.provideLayer(handler, di)
  const res = await Effect.runPromise(runnable);
  expect(res).toMatchObject({
    status: 200,
    body: {
      title: expect.any(String)
    }
  });
});

it('request fail', async () => {
  const handler = getTodoHandler({ path: { id: 'xxx' } })
  const runnable = Effect.provideLayer(handler, di)
  const req = Effect.runPromise(runnable);
  expect(req).rejects.toMatchInlineSnapshot('[Error: {"_tag":"BadRequest","status":400,"body":"validation error"}]');
});

it('validate path params', () => {
  const program = pipe(
    validateRequest({ path: { id: '1' } }),
    Effect.flatMap((req) => Effect.succeed(`${req.path.id} is a number from string`)),
    Effect.catchAll(() => Effect.succeed('Not a number')),
  )
  const res = Effect.runSync(program);
  expect(res).toBe('1 is a number from string')
})

it('validate fail path params', () => {
  const program = pipe(
    validateRequest({ path: { id: 'dummy' } }),
    Effect.flatMap((req) => Effect.succeed(`${req.path.id} is a number from string`)),
    Effect.catchAll(() => Effect.succeed('Not a number')),
  )
  const res = Effect.runSync(program);
  expect(res).toBe('Not a number')
})
