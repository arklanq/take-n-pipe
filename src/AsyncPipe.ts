export class AsyncPipe<V = void> {
  private readonly promise: Promise<V>;

  constructor(promise: Promise<V>) {
    this.promise = promise;
  }

  pipeAsync<R = void>(callback: (value: V) => R): AsyncPipe<Awaited<R>> {
    return new AsyncPipe<Awaited<R>>(this.promise.then(callback) as Promise<Awaited<R>>);
  }

  catchAsync<R = void>(errorHandler: (e: unknown) => R): AsyncPipe<V | R> {
    return new AsyncPipe<V | R>(this.promise.catch(errorHandler));
  }

  toPromise(): Promise<V> {
    return this.promise;
  }
}
