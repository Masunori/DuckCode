"use client";

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) { 
    return (
        <div>
            <h1>Oops, something went wrong.</h1>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Retry</button>
        </div>
    )
}
