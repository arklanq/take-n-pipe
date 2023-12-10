import {jest} from '@jest/globals';
import {take} from 'take-n-pipe';

interface CreateUserEvent {
  name: string;
  email: string;
}

const inputData: unknown = {
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const log: (..._input: unknown[]) => void = jest.fn();

class db {
  static createUser(_user: CreateUserEvent): Promise<string> {
    return Promise.resolve('123-random-user-id-456');
  }
}

class cache {
  static putUser(user: CreateUserEvent & {id: string}): Promise<string> {
    return Promise.resolve(user.id);
  }
}

test('Example: mixed pipes', async () => {
  // 1. Take CreateUserEvent as input
  const userId: string = await take(inputData)
    // 2. Validate data
    .pipe((event: unknown) => {
      if (typeof event !== 'object' || event === null) throw new Error('Invalid request event');

      if (!('name' in event) || typeof event.name !== 'string')
        throw new Error('Event object is missing `name` field of type `string`');

      if (!('email' in event) || typeof event.email !== 'string')
        throw new Error('Event object is missing `email` field of type `string`');

      return event as CreateUserEvent;
    })
    // 3. Sanitize data
    .pipe((event: CreateUserEvent) => {
      event.name = event.name.trim();
      event.email = event.name.trim();

      return event;
    })
    // 4. Log data
    .pipe((event: CreateUserEvent) => {
      log(`Creating user ${event.name}...`);
      return event;
    })
    // 5. Create new user in the database
    // Here we are switch to async context. Remember: this is a one-way ticket.
    .pipeAsync(async (event: CreateUserEvent) => {
      const userId: string = await db.createUser(event);
      return {...event, id: userId};
    })
    // 6. Popualte cache
    // You can also pass a function directly if its declaration matches.
    .pipeAsync(cache.putUser)
    // Obtain results as a Promise
    .toPromise();

  expect(userId).toBe('123-random-user-id-456');
});
