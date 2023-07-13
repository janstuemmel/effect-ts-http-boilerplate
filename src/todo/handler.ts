import * as Effect from '@effect/io/Effect';
import { pipe } from '@effect/data/Function';
import * as S from "@effect/schema/Schema";

import { HttpError } from '../common/http/errors.js';
import { TodoClient } from '../common/client/todoClient.js';
import { AppRequest, AppResponse, createAppResponse } from '../common/http/http.js';
import { validatePathParams } from '../common/validation/validateRequest.js';

const TodoRequestSchema = S.struct({
  path: S.struct({
    id: S.numberFromString(S.string)
  })
})

export const validateRequest = validatePathParams(TodoRequestSchema)

export const getTodo = (id: number) => TodoClient.pipe(
  Effect.flatMap(c => c.request<{title: string}>(`/todos/${id}`)),
  Effect.map(({ data }) => ({ title: data.title })),
);

export const getTodoHandler = (req: AppRequest): Effect.Effect<any, HttpError, AppResponse> => pipe(
  validateRequest(req),
  Effect.map(({ path }) => path.id),
  Effect.flatMap(getTodo),
  Effect.flatMap(createAppResponse)
)