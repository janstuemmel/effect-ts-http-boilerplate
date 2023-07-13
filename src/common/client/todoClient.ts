import * as Context from '@effect/data/Context'
import * as Layer from '@effect/io/Layer';
import * as Effect from '@effect/io/Effect';

import { HttpClient, request } from "./client.js";
import { Config } from "../config/config.js";

export interface TodoClient extends HttpClient {}

export const TodoClient = Context.Tag<TodoClient>();

export const TodoClientLayer = Layer.effect(
  TodoClient,
  Effect.map(Config, ({ todoClient: { baseURL, timeout } }) => TodoClient.of({
    request: (url, req) => request({...req, url, baseURL, timeout })
  })),
);
