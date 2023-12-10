import {SyncPipe, AsyncPipe, take, takeAsync} from 'take-n-pipe';

test('`take(...)` function returns an instance of `SyncPipe` class.', () => {
  const value: string = 'foo';
  expect(take(value)).toBeInstanceOf(SyncPipe);
});

test('`take(value).get()` should return input value intact.', () => {
  // Raw value
  const value: string = 'foo';
  const output: string = take(value).get();
  expect(output).toBe(value);

  // or Promise
  const promiseValue: Promise<'bar'> = Promise.resolve('bar');
  expect(take(promiseValue).get()).toBe(promiseValue);
});

test('`takeAsync(...)` function returns an instance of `AsyncPipe` class.', () => {
  const value: string = 'foo';
  const promise: Promise<string> = Promise.resolve(value);
  expect(takeAsync(promise)).toBeInstanceOf(AsyncPipe);
});

test('`takeAsync(value).toPromise()` should return Promise resolving with unchanged input value.', async () => {
  const value: string = 'foo';
  const promise: Promise<string> = Promise.resolve(value);
  const output: Promise<string> = takeAsync(promise).toPromise();

  expect(output).toBeInstanceOf(Promise);
  await expect(output).resolves.toBe(value);
});
