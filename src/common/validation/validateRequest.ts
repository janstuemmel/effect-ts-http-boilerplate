import * as Effect from '@effect/io/Effect';
import * as S from "@effect/schema/Schema";
import { pipe } from '@effect/data/Function';

import { AppRequest } from "../http/http.js";
import { BadRequest } from '../http/errors.js';

export const validateRequest = <T, D>(schema: S.Schema<T, D>) => (req: AppRequest) => pipe(
  S.parseEither(schema)(req),
  Effect.mapError(() => new BadRequest('validation error')),
)
