import * as Effect from '@effect/io/Effect';
import { pipe } from '@effect/data/Function';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

import { BadRequest, HttpError, InternalServerError, NotFound } from "../http/errors.js";

export type ClientResponse<T> = {
  status: number
  data: T
}

export interface HttpClient {
  readonly request: <T>(url: string, req?: AxiosRequestConfig) => 
    Effect.Effect<never, HttpError, ClientResponse<T>>
}

export const defaultErrorMapper = <T extends unknown>(err: unknown): HttpError<T> => {
  if (err instanceof AxiosError) {
    switch (err.response?.status) {
      case 404:
        return new NotFound(err.response.data);
      case 400:
        return new BadRequest(err.response.data);
    }
  }
  return new InternalServerError;
}

export const request = (
  config: AxiosRequestConfig, 
  errorMapper: (err: unknown) => HttpError = defaultErrorMapper
) => pipe(
  Effect.tryPromise(() => axios(config)),
  Effect.map(({ status, data }) => ({ status, data })),
  Effect.mapError(errorMapper),
)
