
# pipe 'n take

Simple tool to seamlessly chain code execution.



[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


![App Screenshot](./assets/screenshot.png)


## Features

- Ridiculously simple.
- Sync & async context.
- Supports both CJS & ESM standards.
- Full TypeScript support.


## Installation

```bash
  # With NPM
  npm install take-n-pipe

  # With Yarn
  yarn add take-n-pipe
```
    
## Usage

1. Take any input data.

```ts
take(data)
```

2. Transform data with the `pipe(...)` method.

```ts
.pipe((data: object) => JSON.stringify(data))
```

3. \[Optionally] Jump to asynchronous context easily.

```ts
.pipeAsync(async (json: string) => {
    return await server.send(json);
})
```

> Note that if you are using asynchronous context you should await on the chain result.
> 
> `await take(...).pipeAsync(...).get()`

4. Obtain results.

```
.get()
```
## Full example

```ts
const response: SomeData = await take(process.env.SECRET_KEY)
  .pipe((secret: string | undefined) => secret ?? fallbackSecret)
  .pipe((secret: string) => {
    return new SomeComplicatedSDK(secret);
  })
  .pipeAsync(async (sdk: SomeComplicatedSDK) => {
    return await sdk.contactServer();
  })
  .get();
```

## TODO

- [ ] Write some tests.
- [ ] Implement new `Pipe.catch(...)` method.
