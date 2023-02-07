import {AsyncPipe} from './AsyncPipe.js';

export class SyncPipe<V = void> {
  private readonly value: V;
  private error: unknown = null;

  constructor(value: V, error?: undefined);
  constructor(value: unknown, error: unknown);
  constructor(value: V, error: unknown = null) {
    this.value = value;
    this.error = error;
  }

  private runSafely<A, R>(callback: (value: A) => R, value: A): [R, unknown] | [undefined, unknown] {
    try {
      return [callback(value), undefined];
    } catch(e: unknown) {
      this.error = e;
      return [undefined, e];
    }
  }

  pipe<R = void>(callback: (value: V) => R): SyncPipe<R> {
    if(this.error) return new SyncPipe(undefined, this.error);

    const [nextValue, error] = this.runSafely(callback, this.value);
    return new SyncPipe(nextValue, error);
  }

  pipeAsync<R extends Promise<any> = Promise<void>>(callback: (value: V) => R): AsyncPipe<Awaited<R>> {
    if(this.error)
      return new AsyncPipe<Awaited<R>>(Promise.reject(this.error));
    else
      return new AsyncPipe<Awaited<R>>(callback(this.value));
  }

  catch<R = void>(errorHandler: (e: unknown) => R): SyncPipe<V | R> {
    if(this.error) {
      const [nextValue, error] = this.runSafely(errorHandler, this.error);
      try {
        return new SyncPipe(nextValue, error);
      } finally {
        this.error = null;
      }
    } else {
      return new SyncPipe(this.value);
    }
  }

  get(): V {
    if(this.error) throw this.error;
    else return this.value;
  }
}
