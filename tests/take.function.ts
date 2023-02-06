import {Pipe, take} from 'take-n-pipe';

test('`take(...)` function returns an instance of `Pipe` class.', () => {
  expect(take('foo')).toBeInstanceOf(Pipe);
});

test('`take(value).get()` should return input value intact.', () => {
  const value: string = 'foo';
  expect(take(value).get()).toBe(value);

  const promiseValue: Promise<'bar'> = Promise.resolve('bar');
  expect(take(promiseValue).get()).toBe(promiseValue);
});
