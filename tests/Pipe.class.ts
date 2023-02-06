import {Pipe, take} from 'take-n-pipe';

test('`Pipe.pipe(...)` should return next Pipe class instance, not the same one.', () => {
  const firstPipeClassInstance: Pipe<string> = take('foo');
  const lastPipeClassInstance: Pipe<string> = firstPipeClassInstance.pipe((value: string) => value);

  expect(firstPipeClassInstance).toBeInstanceOf(Pipe);
  expect(lastPipeClassInstance).toBeInstanceOf(Pipe);
  expect(firstPipeClassInstance).not.toBe(lastPipeClassInstance);
});

test('Sync chain should return output value, unwrapped.', () => {
  const pipeOutput: string = take('foo')
    .pipe((value: string) => value + ' bar')
    .get();

  expect(pipeOutput).toBe('foo bar');
});

test('Async chain should return output value wrapped with Promise.', async () => {
  {
    const pipeOutput: Promise<string> = take('foo')
      .pipeAsync((value: string) => value + ' bar')
      .get();

    await expect(pipeOutput).resolves.toBe('foo bar');
  }

  {
    const pipeOutput: Promise<string> = take('foo')
      .pipeAsync(async (value: string): Promise<string> => {
        return await new Promise((resolve) => setTimeout(() => resolve(value), 1000));
      })
      .pipeAsync(async (value: string): Promise<string> => value + ' bar')
      .get();

    await expect(pipeOutput).resolves.toBe('foo bar');
  }
});

test('Chain should return desired value in sync context', () => {
  const pipeOutput: string = take('foo')
    .pipe((value: string) => value + ' bar')
    .pipe((value: string) => value.split(' '))
    .pipe((value: string[]) => value.concat(['baz']))
    .pipe((value: string[]) => value.join(' '))
    .get();

  expect(pipeOutput).toBe('foo bar baz');
});

test('Chain should return desired value in async context', async () => {
  const pipeOutput: Promise<string> = take(Promise.resolve('foo'))
    .pipeAsync((value: string) => value + ' bar')
    .pipeAsync((value: string) => value.split(' '))
    .pipeAsync((value: string[]) => value.concat(['baz']))
    .pipeAsync((value: string[]) => value.join(' '))
    .get();

  await expect(pipeOutput).resolves.toBe('foo bar baz');
});

test('Once chain is switched to async context it has to return Promise.', async () => {
  // Started with sync context ...
  const pipeOutput: Promise<string> = take('foo')
    .pipe((value: string) => value + ' bar')
    // ... transitioned to async context
    .pipeAsync((value: string) => value.split(' '))
    .pipeAsync((value: string[]) => value.concat(['baz']))
    // ... going back to sync context - dealing with `Promise` object
    .pipe((promise: Promise<string[]>) => promise.then((value: string[]) => value.join(' ')))
    // ... finishing up
    .get();

  await expect(pipeOutput).resolves.toBe('foo bar baz');
});
