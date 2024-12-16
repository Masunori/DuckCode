export default function CodeOutput({ output=">> Your code will be displayed here..." }) {
    return (
        <div id="code-output">
            {output.split('\n').map((line, index) => (
                <code key={index}>
                    {line}<br />
                </code>
            ))}
        </div>
    )
}