import {SyncPipe, AsyncPipe, Pipe, take} from 'take-n-pipe';
import {jest} from '@jest/globals';

test('`SyncPipe.pipe(...)` should return next SyncPipe class instance, not the same one.', () => {
  const firstPipe: SyncPipe<string> = take('foo');
  const lastPipe: SyncPipe<string> = firstPipe.pipe((value: string) => value);

  expect(firstPipe).toBeInstanceOf(SyncPipe);
  expect(lastPipe).toBeInstanceOf(SyncPipe);
  expect(firstPipe).not.toBe(lastPipe);
});

test('`SyncPipe.pipe(...)` chain should return desired value.', () => {
  const pipeOutput: string = take('foo')
    .pipe((value: string) => value + ' bar')
    .pipe((value: string) => value.split(' '))
    .pipe((value: string[]) => value.concat(['baz']))
    .pipe((value: string[]) => value.join(' '))
    .get();

  expect(pipeOutput).toBe('foo bar baz');
});

test('`SyncPipe.asyncPipe(...)` method permanently switches chain from SyncPipe to AsyncPipe.', () => {
  const firstPipe: SyncPipe<string> = take('foo');
  const lastPipe: AsyncPipe<string> = firstPipe.pipeAsync(async (value: string) => value);

  expect(firstPipe).toBeInstanceOf(SyncPipe);
  expect(lastPipe).toBeInstanceOf(AsyncPipe);
  expect(firstPipe).not.toBe(lastPipe);
});

test('`SyncPipe` class instance is assignable to `Pipe` type.', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pipe: Pipe<string> = take('foo');
});

test('Error can be catched with `SyncPipe.catch(...)` method.', () => {
  const ERR_MESSAGE = 'Response error';
  const pipe: SyncPipe<string> = take('error').pipe((response: string) => {
    if (response === 'error') throw new Error(ERR_MESSAGE);
    else return response;
  });
  const errorHandler = jest.fn();

  const nextPipe: Pipe<unknown> = pipe.catch(errorHandler);

  expect(nextPipe.get()).toBeUndefined();
  expect(errorHandler.mock.calls.length).toEqual(1);

  const fnCall = errorHandler.mock.calls[0];
  expect(fnCall.length).toEqual(1);
  expect(fnCall[0]).toBeInstanceOf(Error);
  expect(fnCall[0]).toMatchObject({
    message: expect.stringMatching(ERR_MESSAGE),
  });
});

test('`SyncPipe.catch(...)` method callback can also return new value to chain pipes further.', () => {
  type ServerResponse = {foo: 'bar'; fallbackResponse: boolean};
  const ERR_MESSAGE = 'Response error';
  let suspiciousPipe: SyncPipe<ServerResponse> = take('ERR_INTERNAL').pipe((code: string) => {
    if (code === 'ERR_INTERNAL') throw new Error(ERR_MESSAGE);
    else return {foo: 'bar', fallbackResponse: false};
  });

  const fallbackResponse: ServerResponse = {foo: 'bar', fallbackResponse: true};
  suspiciousPipe = suspiciousPipe.catch((_e: unknown): ServerResponse => fallbackResponse);

  const fn = jest.fn();
  suspiciousPipe.pipe(fn);

  expect(fn.mock.calls.length).toEqual(1);
  const fnCall = fn.mock.calls[0];

  expect(fnCall[0]).toMatchObject({foo: 'bar', fallbackResponse: true});
});

describe('Error thrown within `SyncPipe.catch(...)` callback...', () => {
  let suspiciousPipe!: SyncPipe<string>;
  const FIRST_ERROR_MESSAGE = 'First, expected error';
  const SECOND_ERROR_MESSAGE = 'Second, unexpected error';

  beforeEach(() => {
    suspiciousPipe = take('foo')
      .pipe(() => {
        throw new Error(FIRST_ERROR_MESSAGE);
      })
      .catch((_e: unknown) => {
        throw new Error(SECOND_ERROR_MESSAGE);
      });
  });

  test('... can be catched again with `SyncPipe.catch(...)` method.', () => {
    const errorHandler = jest.fn();
    const nextPipe: SyncPipe<unknown> = suspiciousPipe.catch(errorHandler);

    expect(nextPipe.get()).toBeUndefined();
    expect(errorHandler.mock.calls.length).toEqual(1);

    const fnCall = errorHandler.mock.calls[0];
    expect(fnCall.length).toEqual(1);
    expect(fnCall[0]).toBeInstanceOf(Error);
    expect(fnCall[0]).toMatchObject({
      message: expect.stringMatching(SECOND_ERROR_MESSAGE),
    });
  });

  test('... next `SyncPipe.get(...)` call will throw stored error.', () => {
    expect(() => suspiciousPipe.get()).toThrowError(SECOND_ERROR_MESSAGE);
  });

  test('... next `SyncPipe.pipe(...)` call callback will not be executed.', () => {
    const fn = jest.fn();
    suspiciousPipe.pipe(fn);
    expect(fn.mock.calls.length).toEqual(0);
  });

  test('... next `SyncPipe.pipeAsync(...)` call callback will not be executed.', async () => {
    const fn = jest.fn(() => Promise.resolve());
    const asyncPipe: AsyncPipe<void> = suspiciousPipe.pipeAsync(fn);

    const asyncPipeOutput: Promise<void> = asyncPipe.toPromise();
    await expect(asyncPipeOutput).rejects.toBeInstanceOf(Error);

    expect(fn.mock.calls.length).toEqual(0);
  });

  test('... next `SyncPipe.pipeAsync(...)` call will create AsyncPipe with rejected promise stored.', async () => {
    const fn = jest.fn(() => Promise.resolve());
    const asyncPipe: AsyncPipe<void> = suspiciousPipe.pipeAsync(fn);
    expect(asyncPipe).toBeInstanceOf(AsyncPipe);

    const asyncPipeOutput: Promise<void> = asyncPipe.toPromise();
    await expect(asyncPipeOutput).rejects.toBeInstanceOf(Error);
    await expect(asyncPipeOutput).rejects.toMatchObject({
      message: SECOND_ERROR_MESSAGE,
    });
  });
});
