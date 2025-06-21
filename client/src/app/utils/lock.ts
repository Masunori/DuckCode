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
            throw new Error("Another function is acquiring the same lock, please try again later.");
        }

        try {
            return await func();
        } finally {
            release();
        }
    }
}