import {SyncPipe} from './SyncPipe.js';
import {AsyncPipe} from './AsyncPipe.js';

export function take<V>(value: V): SyncPipe<V> {
  return new SyncPipe<V>(value);
}

export function takeAsync<P extends Promise<any>>(promise: P): AsyncPipe<Awaited<P>> {
  return new AsyncPipe<Awaited<P>>(promise);
}
