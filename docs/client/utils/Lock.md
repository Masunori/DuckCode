# Lock

**NOTE**: The `Lock` class is no longer used. Please use the `LockV2` class.

The [`LockV2`](../../../client/src/utils/lock.ts) utility encapsulates a locking mechanism that prevents multiple subscribed functions from executing at the same time.

Each `LockV2` instance has one private field `_locked`, which controls the state of the lock. 

```ts
private _locked = false;
```

Observers can subscribe to the lock through the `subscribe` method:

```ts
public subscribe(fn: (v: boolean) => void): () => void
```

As seen, observers must have the shape of `(v: boolean) => void`. Whenever the state of the lock is updated, the observers will be notified.

Suppose you have a bunch of functions that should not be able to run concurrently. You wrap them within the `call` method.

```ts
public async call<T>(func: () => Promise<T>): Promise<T | null>
```

Because `call` is asynchronous, the functions that you want to run must return a Promise. Currently, `LockV2` only supports functions with no arguments. There is no plan to extend support to functions with arguments.

When `call` is invoked with a function, it will first try to acquire the lock. If acquisition is successful, the lock will be held, the function executes, and `call` finally releases the lock.

If the lock has already been acquired by another function when you invoke `call`, a `LockUnavailableError` is thrown.

```ts
export class LockUnavailableError extends Error
```

---

Now, let's demonstrate how to use the lock.

```ts
// instantiates a new lock
const lock: LockV2 = new LockV2();

// define an asynchronous function which only resolves after 1 second
async function sayHello(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hello, world!");
        }, 1000);
    });
}

// run the demo
async function runDemo() {
    const firstCall = lock.call(async () => {
        console.log("First call acquired the lock.");
        const message = await sayHello();
        console.log("First call result: ", message);
        return message;
    });

    // second call is when the first call has already acquired the lock
    setTimeout(async () => {
        try {
            await lock.call(async () => {
                console.log("Second call acquired the lock.");
                const message = await sayHello();
                console.log("Second call results: " , message);
                return message;
            });
        } catch (err) {
            if (err instanceof LockUnavailableError) {
                console.error("Second call failed to acquire the lock: ", err.message);
            } else {
                console.error("Unexpected error: ", err);
            }
        }
    }, 100);
}

runDemo();
```

You will expect
```
First call acquired the lock.
Second call failed to acquire the lock: Another function is acquiring the same lock, please try again later.
First call result: Hello, world!
```