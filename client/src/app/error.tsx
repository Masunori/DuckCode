"use client";

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) { 
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            height: "100vh",
            textAlign: "center",
        }}>
            <h1>Oops, something went wrong.</h1>
            <p><b>Error</b>: {error.message}</p>
            <button onClick={() => reset()}>Retry</button>
        </div>
    )
}
