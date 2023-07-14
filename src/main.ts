import http from 'http';
import findMyWay from 'find-my-way';

import * as Layer from '@effect/io/Layer';

import {getTodoHandler} from './todo/handler.js';
import { ConfigLayer } from './common/config/config.js';
import { TodoClientLayer } from './common/client/todoClient.js';

import { wrapRequest } from './common/http/wrapRequest.js';

// di

const di = ConfigLayer.pipe(Layer.provide(Layer.mergeAll(
  TodoClientLayer
)))

// app

const router = findMyWay();
const wrapEffect = wrapRequest(di);

router.on('GET', '/todos/:id', wrapEffect(getTodoHandler));

export const server = http.createServer((req, res) => {
  router.lookup(req, res)
});
