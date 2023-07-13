import * as S from "@effect/schema/Schema";
import { runSyncExit } from '@effect/io/Effect'
import { expect, it } from 'vitest';
import { validateRequest } from "./validateRequest.js";

const schema = S.struct({
  path: S.struct({
    foo: S.numberFromString(S.string)
  })
})

it('should validate request', () => {
  const validate = validateRequest(schema)
  const res = runSyncExit(validate({ path: { foo: '1' } }))
  expect(res._tag).toBe('Success');
})

it('should not validate request', () => {
  const validate = validateRequest(schema)
  const res = runSyncExit(validate({ path: { foo: 'xxx' } }))
  expect(res._tag).toBe('Failure');
})
