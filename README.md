# take 'n pipe

Simple tool to seamlessly chain code execution.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

![Code sample](./assets/hero-image.png)

## Features

- 😝 Ridiculously simple.
- ⚙️ Sync & async context.
- 📦 Distributions in ESM and CommonJS standards.
- 📘 Full TypeScript support.
- 🔋 Bateries included - no dependencies.
- 🧪 Well tested with Jest.

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
.pipe((data: object) => {...})
```

3. [Optionally] Catch errors with `catch(...)` method.

```ts
.catch((error: unknown) => {...})
```

4. Obtain results.

```
.get()
```

## Examples

<details>
<summary>Simple, synchronous pipes</summary>

https://github.com/IdkMan2/take-n-pipe/blob/2787121d24a90a57f47560c727849df37ab4d793/tests/examples/sync-pipes.ts#L1-L46
</details>

## TODO

- [X] Write some tests.
- [X] Implement new `Pipe.catch(...)` method.
- [ ] Allow merging two `Pipe`'s together somehow.
- [ ] (Optionally) Setup CI/CD to look for TS, ESLint, Jest issues.
- [ ] Add real-world examples.
