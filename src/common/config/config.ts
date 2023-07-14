import * as Context from "@effect/data/Context"
import * as Effect from '@effect/io/Effect';
import * as Layer from '@effect/io/Layer';
import * as C from '@effect/io/Config';

import stageConfig from '../../../config/stage.js'
import integrationConfig from '../../../config/stage.js'

const configMap: Record<string, AppConfig> = {
  integration: integrationConfig,
  stage: stageConfig,
}

export type HttpClientConfig = {
  baseURL: string
  timeout: number
}

export type AppConfig = {
  todoClient: HttpClientConfig
}

export const Config = Context.Tag<AppConfig>();

export const ConfigLayer = Layer.effect(
  Config,
  Effect.map(
    Effect.config(C.string('ENV').pipe(C.withDefault('integration'))
  ), (env) => {
    return configMap[env] ?? integrationConfig
  })
);
