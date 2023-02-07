import {SyncPipe} from './SyncPipe.js';
import {AsyncPipe} from './AsyncPipe.js';

export {take, takeAsync} from './take.js';
export {SyncPipe, AsyncPipe};
export type Pipe<V> = SyncPipe<V> | AsyncPipe<V>;
