import * as Context from "@effect/data/Context"
import * as Effect from '@effect/io/Effect';

export type HttpClientConfig = {
  baseURL: string
  timeout: number
}

export type AppConfig = {
  todoClient: HttpClientConfig
}

export interface Config {
  readonly appConfig: Effect.Effect<never, never, AppConfig>
}

export const Config = Context.Tag<AppConfig>();
