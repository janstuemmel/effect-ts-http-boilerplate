import { it, expect } from 'vitest';

import * as Effect from '@effect/io/Effect';
import { pipe } from '@effect/data/Function';

import { TodoClient } from '../common/client/todoClient.js';
import { validate, getTodoHandler } from './handler.js';

import { HttpError } from '../common/http/errors.js';
import { ClientResponse, HttpClient } from '../common/client/client.js';
import { AppResponse } from '../common/http/http.js';

const provideMockContext = (
  handler: Effect.Effect<HttpClient, HttpError, AppResponse>,
  request: Effect.Effect<never, HttpError, ClientResponse>,
) => handler.pipe(
  Effect.provideService(TodoClient, TodoClient.of({ request: () => request }))
)

it('request success', async () => {
  const todo = { title: 'dummy' }
  const handler = getTodoHandler({ path: { id: '1' } })
  const runnable = provideMockContext(handler, Effect.succeed({ data: todo, status: 200}))
  const res = await Effect.runPromise(runnable);
  expect(res).toMatchObject({ status: 200, body: todo });
});

it('return error when fail', async () => {
  const handler = getTodoHandler({ path: { id: '1' } })
  const runnable = provideMockContext(handler, Effect.fail(new HttpError))
  const req = Effect.runPromise(runnable);
  await expect(req).rejects.toMatchInlineSnapshot('[Error: {"_tag":"HttpError","status":0}]')
});

it('request fail', async () => {
  const handler = getTodoHandler({ path: { id: 'xxx' } })
  const runnable = provideMockContext(handler, Effect.fail(new HttpError))
  const req = Effect.runPromise(runnable);
  await expect(req).rejects.toMatchInlineSnapshot('[Error: {"_tag":"BadRequest","status":400,"body":"validation error"}]');
});

it('validate path params', () => {
  const program = pipe(
    validate({ path: { id: '1' } }),
    Effect.flatMap((req) => Effect.succeed(`${req.path.id} is a number from string`)),
    Effect.catchAll(() => Effect.succeed('Not a number')),
  )
  const res = Effect.runSync(program);
  expect(res).toBe('1 is a number from string')
})

it('validate fail path params', () => {
  const program = pipe(
    validate({ path: { id: 'dummy' } }),
    Effect.flatMap((req) => Effect.succeed(`${req.path.id} is a number from string`)),
    Effect.catchAll(() => Effect.succeed('Not a number')),
  )
  const res = Effect.runSync(program);
  expect(res).toBe('Not a number')
})
