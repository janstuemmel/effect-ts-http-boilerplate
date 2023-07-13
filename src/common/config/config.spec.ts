import { it, expect } from 'vitest';
import { pipe } from '@effect/data/Function';
import * as Effect from '@effect/io/Effect';
import { AppConfig, Config } from './config.js';

const configGetterByKey = (key: keyof AppConfig) => Config.pipe(
  Effect.map((config) => config[key])
)

it('get config key', () => {
  const todoClient = {
    baseURL: 'foo.bar',
    timeout: 1111,
  }

  const program = pipe(
    Effect.succeed('todoClient' as keyof AppConfig),
    Effect.flatMap(configGetterByKey)
  )

  const runnable = Effect.provideService(
    program,
    Config,
    Config.of({ todoClient })
  )

  const res = Effect.runSync(runnable);
  expect(res).toMatchObject(todoClient)
});
