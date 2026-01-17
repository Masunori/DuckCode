import { printd } from "./debugUtils";

/**
 * The Lock class encapsulates a locking mechanism, used when you have multiple functions that cannot be executed concurrently.
 */
export class Lock {
    private isLocked = false;

    /**
     * The status of the lock.
     */
    public get locked() : boolean {
        return this.isLocked;
    }
    

    /**
     * Attempts to acquire a lock.
     * @returns null if the lock is being acquired by another function, a function to release the lock otherwise
     */
    tryAcquire(): (() => void) | null {
        if (this.isLocked) {
            return null;
        }

        this.isLocked = true;
        return () => {
            this.isLocked = false;
        }
    }

    /**
     * Invoke a function that attempts to acquire the lock, execute, and release the lock.
     * This will throw an error if the lock is currently acquired by another function.
     * 
     * @param func The function
     * @returns The results of the function if it manages to acquire the lock and execute
     */
    async call<T>(func: () => Promise<T>) {
        const release = this.tryAcquire();

        if (!release) {
            throw new LockUnavailableError();
        }

        try {
            return await func();
        } finally {
            release();
        }
    }
}

/**
 * The LockUnavailableError is thrown when two or more actions share the same lock, and one function is trying to 
 * acquire the lock when another function is using it.
 */
export class LockUnavailableError extends Error {
    constructor(message = "Another function is acquiring the same lock, please try again later.") {
        super(message);
        this.name = "LockUnavailableError";
        Object.setPrototypeOf(this, LockUnavailableError.prototype);
    }
}


/**
 * The LockV2 encapsulates a locking mechanism, used when you have multiple functions that cannot be executed concurrently.
 * The locked state becomes an observable, so that other parts of the application can react to the locked state changes.
 */
export class LockV2 {
    private _locked = false;
    private listeners: Set<(v: boolean) => void> = new Set();

    /**
     * The status of the lock.
     */
    public get locked() : boolean {
        return this._locked;
    }

    private set locked(value: boolean) {
        // avoid notifying listeners if the value does not change
        if (this._locked === value) {
            return;
        }

        this._locked = value;
        this.listeners.forEach(listener => listener(this._locked));
    }

    /**
     * Subscribe to changes in the locked state.
     * 
     * @param fn The function to be called when the locked state changes
     * @returns The function to unsubscribe the listener
     */
    public subscribe(fn: (v: boolean) => void): () => void {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }

    /**
     * Tries to acquire a lock.
     * @returns 
     */
    private tryAcquire(): (() => void) | null {
        if (this.locked) {
            return null;
        }

        this.locked = true;
        return () => {
            this.locked = false;
        }
    }

    /**
     * Invokes a function that attempts to acquire the lock, execute, and release the lock.
     * This will return null if the lock is currently acquired by another function.
     * 
     * @param func The function to be executed while holding the lock
     * @returns The result of the function if the lock was acquired, or null if the lock was not acquired
     */
    public async call<T>(func: () => Promise<T>): Promise<T | null> {
        printd("@lib/utils/lock.ts", "LockV2.call invoked. Current locked state:", this.locked);
        const release = this.tryAcquire();

        if (!release) {
            return null;
        }

        try {
            return await func();
        } finally {
            release();
        }
    }
}