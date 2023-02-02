export class Pipe<V> {
  private readonly value;

  constructor(value: V) {
    this.value = value;
  }

  pipe<R>(callback: (value: V) => R): Pipe<R> {
    return new Pipe(callback(this.value));
  }

  pipeAsync<R>(callback: (value: Awaited<V>) => R): R extends Promise<infer P> ? Pipe<Promise<P>> : Pipe<Promise<R>> {
    // Workaround for https://github.com/microsoft/TypeScript/issues/33912
    type ReturnType = R extends Promise<infer P> ? Pipe<Promise<P>> : Pipe<Promise<R>>;

    if (this.value instanceof Promise) {
      return new Pipe(this.value.then((awaitedValue: Awaited<V>): R => callback(awaitedValue))) as ReturnType;
    } else {
      return new Pipe(Promise.resolve(callback(this.value as Awaited<V>))) as ReturnType;
    }
  }

  get(): V {
    return this.value;
  }

  public static take = take;
}

export function take<V>(value: V): Pipe<V> {
  return new Pipe(value);
}
