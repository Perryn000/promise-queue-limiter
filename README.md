# 🐻 PromiseQueueLimiter

`PromiseQueueLimiter` is a simple class for controlling the number of concurrently running asynchronous operations. It helps
limit the number of async functions executed at the same time and maintains a queue for tasks that cannot be executed
immediately.

## Installation

You can install this module via npm:

```bash
npm install promise-queue-limiter
```

## Description

The `PromiseQueueLimiter` class allows you to effectively manage asynchronous functions by limiting the number of concurrent
operations. This is useful when working with resources that have limitations on the number of simultaneous requests (
e.g., APIs with rate limiting, databases, or file systems).

### Key Features:

- Limits the number of concurrent asynchronous operations.
- Maintains a queue for tasks waiting to be processed.
- Provides the ability to clear the queue.

## Usage

### Import and Initialization

```typescript
import { PromiseQueueLimiter } from 'promise-queue-limiter';

const queue = new PromiseQueueLimiter({ concurrent: 3 }); // Up to 3 concurrent requests
```

### Example Usage

```typescript
const fetchData = (url: string) => {
  return fetch(url).then(response => response.json());
};

// Add an asynchronous function to the queue
queue.add(fetchData, 'https://api.example.com/data1').then(data => {
  console.log('Received data:', data);
});

queue.add(fetchData, 'https://api.example.com/data2').then(data => {
  console.log('Received data:', data);
});

queue.add(fetchData, 'https://api.example.com/data3').then(data => {
  console.log('Received data:', data);
});

queue.add(fetchData, 'https://api.example.com/data4').then(data => {
  console.log('Received data:', data);
});
```

In this example, `PromiseQueueLimiter` limits the number of concurrent requests to 3. Other requests will wait until the
previous ones are completed before starting new ones.

### Configuration

The constructor accepts an object with the following parameter:

- **concurrent** (default: 1) — the maximum number of tasks to execute concurrently. For instance, if you set
  `concurrent: 5`, no more than five tasks will run at the same time.

```typescript
const queue = new PromiseQueueLimiter({ concurrent: 5 });
```

### Methods

- **add(method, ...args)**: Adds an asynchronous function to the queue.

    - `method`: The asynchronous function to be executed.
    - `args`: The arguments to be passed to the function.

- **clear()**: Clears the queue and removes all active promises.

  ```typescript
  queue.clear();
  ```

- **size**: Returns the number of tasks in the queue.

  ```typescript
  console.log(queue.size); // 2
  ```

- **isEmpty**: Returns `true` if the queue is empty.

  ```typescript
  console.log(queue.isEmpty); // false
  ```

## Many requests at one time

<hr>

### Bad way

#### ⚠️ *Warning:* For most apis this way create many errors

In this example you send 1000 requests at one time to some server.<br>
Most apis returns error 429 "Too Many Requests" for so many requests.

```javascript
import api from './services'

const textList = [
  'Some text 1',
  'Some text 2',
  // ...
] // 1000 elements

// create 1000 requests at one time
const promises = textList.map(text => api.checkText(text))

Promise.allSettled(promises).then(() => {
  console.log('completed all checking requests')
})
```

<hr/>

### Good way

#### ✅ Works for most apis

### `concurrent: number`

```javascript
import PromiseQueueLimiter from 'promise-queue-limiter'
import api from './services'

const queue = new PromiseQueueLimiter({
  concurrent: 5
})

const textList = [
  'Some text 1',
  'Some text 2',
  // ...
] // 1000 elements

// create only 5 requests at one time
const promises = textList.map(text => queue.add(api.checkText, text))

Promise.allSettled(promises).then(() => {
  console.log('completed all checking requests')
})
```

## Conclusion

`PromiseQueueLimiter` is a convenient tool for managing asynchronous operations with a limited number of concurrent tasks. It’s
perfect for scenarios where it’s important to control parallelism to avoid overloading a server or an external API.**

## Repository

You can find the source code and contribute to the project on [GitHub](https://github.com/Perryn000/promise-queue-limiter).