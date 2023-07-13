import http from 'http';
import findMyWay from 'find-my-way';

import * as Layer from '@effect/io/Layer';
import { pipe } from '@effect/data/Function';

import {getTodoHandler} from './todo/handler.js';
import { Config } from './common/config/config.js';
import { TodoClientLayer } from './common/client/todoClient.js';

import stageConfig from '../config/stage.js';
import { wrapRequest } from './common/http/wrapRequest.js';

// di

const config = Layer.succeed(
  Config,
  Config.of(stageConfig)
);

const di = pipe(
  config,
  Layer.provide(TodoClientLayer),
);

// app

const router = findMyWay();
const wrapEffect = wrapRequest(di);

router.on('GET', '/todos/:id', wrapEffect(getTodoHandler));

export const server = http.createServer((req, res) => {
  router.lookup(req, res)
});
