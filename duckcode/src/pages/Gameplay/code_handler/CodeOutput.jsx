export default function CodeOutput({ output }) {
    return (
        <div id="code-output" style={{
            color: output.status === "success" || output.status === "loading"
                    ? "var(--font-colour)"
                    : "var(--error-font-colour)"
        }}>
            {output.output.split('\n').map((line, index) => (
                <code key={index}>
                    {line}<br />
                </code>
            ))}
        </div>
    )
}