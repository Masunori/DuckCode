import { useEffect, useState } from "react"

export default function CodeOutput({ output }) {
    const [background, setBackground] = useState("var(--terminal-like-background-color)");
    const [border, setBorder] = useState('1px solid var(--terminal-like-background-color)');

    useEffect(() => {
        setBackground(output.status === "loading"
            ? "var(--terminal-like-background-color)"
            : output.status === "success"
            ? "var(--valid-code-bg-color)"
            : "var(--invalid-code-bg-color)");

        setBorder(output.status === "loading"
            ? "1px solid var(--terminal-like-background-color)"
            : output.status === "success"
            ? "1px solid var(--valid-code-border-color)"
            : "1px solid var(--invalid-code-border-color)");
    }, [output.status]);

    return (
        <div id="code-output" style={{
            backgroundColor: background,
            border: border,
            transitionDuration: '0.25s'
        }}>
            {output.output.split('\n').map((line, index) => (
                <code key={index} style={{
                    backgroundColor: background
                }}>
                    {line}<br />
                </code>
            ))}
        </div>
    )
}