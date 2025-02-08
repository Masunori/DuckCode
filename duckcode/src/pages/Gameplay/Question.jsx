import { useContext } from "react"
import { QuestionContext } from "./Gameplay";

function Example( {exampleObject} ) {
    return (
        <div className="example">
            <div className="decorator-line"></div>
            <div className="example-content">
                <h4>Input:</h4>
                {exampleObject.input.map((i, index) => <span key={index}><code>{i}</code></span>)}
                <h4>Output:</h4>
                {exampleObject.output.map((o, index) => <span key={index}><code>{o}</code></span>)}
                <h4>Explanation:</h4>
                {exampleObject?.explanation || "None"}
            </div>
        </div>
    )
}

/**
 * Encapsulates the question component of the gameplay interface of DuckCode.
 * @returns the question component
 */
export default function Question() {
    const questionTemplate = useContext(QuestionContext);

    return (
        <div id="question">
            <h1>{questionTemplate.title}</h1>
            <h3>Difficulty: {questionTemplate.difficulty}</h3>
            
            <div id="description">
                <h3>Description</h3>
                {questionTemplate.description.map((str, index) => <p key={index}>{str}</p>)}
            </div>

            <div>
                <h3>Input</h3>
                <ul>  
                    {questionTemplate.input.map((i, index) => <li key={index}>{i}</li>)}
                </ul>
            </div>

            <div>
                <h3>Output:</h3>
                <ul>
                    {questionTemplate.output.map((o, index) => <li key={index}>{o}</li>)}
                </ul>
            </div>

            <h3>Example</h3>
            {questionTemplate.examples.map((example, idx) => (
                <div key={idx}>
                    <Example exampleObject={example} />
                </div>
            ))}
            <div id='constraints'>
                <h3>Constraints:</h3>
                <ul>
                    {questionTemplate.constraints.map((cons, index) => <li key={index}>{cons}</li>)}
                </ul>
            </div>
        </div>
    )
}