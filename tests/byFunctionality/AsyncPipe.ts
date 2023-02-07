import {AsyncPipe, Pipe, takeAsync} from 'take-n-pipe';
import {jest} from '@jest/globals';

test('`AsyncPipe.pipeAsync(...)` should return next AsyncPipe class instance, not the same one.', () => {
  const firstPipeClassInstance: AsyncPipe<string> = takeAsync(Promise.resolve('foo'));
  const lastPipeClassInstance: AsyncPipe<string> = firstPipeClassInstance.pipeAsync(async (value: string) => value);

  expect(firstPipeClassInstance).toBeInstanceOf(AsyncPipe);
  expect(lastPipeClassInstance).toBeInstanceOf(AsyncPipe);
  expect(firstPipeClassInstance).not.toBe(lastPipeClassInstance);
});

test('`AsyncPipe.pipeAsync(...)` chain should return desired value.', async () => {
  const pipeOutput: Promise<string> = takeAsync(Promise.resolve('foo'))
    .pipeAsync((value: string) => value + ' bar')
    .pipeAsync((value: string) => value.split(' '))
    .pipeAsync((value: string[]) => value.concat(['baz']))
    .pipeAsync((value: string[]) => value.join(' '))
    .toPromise();

  await expect(pipeOutput).resolves.toBe('foo bar baz');
});

test('`AsyncPipe` class instance is assignable to `Pipe` type.', () => {
  // noinspection JSUnusedLocalSymbols
  const pipe: Pipe<string> = takeAsync(Promise.resolve('foo'));
});

test('Error can be catched with `AsyncPipe.catch(...)` method.', async () => {
  const ERR_MESSAGE = 'Response error';
  const pipe: AsyncPipe<string> = takeAsync(Promise.resolve('error'))
    .pipeAsync((response: string) => {
      if(response === 'error') throw new Error(ERR_MESSAGE);
      else return response;
    });
  const errorHandler = jest.fn();

  const nextPipe: Pipe<unknown> = pipe.catchAsync(errorHandler);

  await expect(nextPipe.toPromise()).resolves.toBeUndefined();
  expect(errorHandler.mock.calls.length).toEqual(1);

  const fnCall = errorHandler.mock.calls[0];
  expect(fnCall.length).toEqual(1);
  expect(fnCall[0]).toBeInstanceOf(Error);
  expect(fnCall[0]).toMatchObject({
    message: expect.stringMatching(ERR_MESSAGE)
  });
});
