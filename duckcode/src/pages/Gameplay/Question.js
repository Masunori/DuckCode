export class QuestionTemplate {
    title;
    difficulty;
    description;
    examples;
    constraints;

    constructor(title, difficulty, description, examples, constraints) {
        this.title = title;
        this.difficulty = difficulty;
        this.description = description.split('\n');
        this.examples = examples;
        this.constraints = constraints.split('\n');
    }
}

function Example( {count, input, output, explain = null} ) {
    if (explain) {
        return (
            <div className="example">
                <div className="decorator-line"></div>
                <div className="example-content">
                    <h3>Example {count}:</h3>
                    <p>Input: <code>{input}</code></p>
                    <p>Output: <code>{output}</code></p>
                    <p>Explanation: {explain}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="example">
                <div className="decorator-line"></div>
                <div className="example-content">
                    <h3>Example {count}:</h3>
                    <p>Input: <code>{input}</code></p>
                    <p>Output: <code>{output}</code></p>
                </div>
            </div>
        )
    }
}

export default function Question({ questionTemplate }) {
    let index = 1;
    return (
        <div id="question">
            <h1>{questionTemplate.title}</h1>
            <h3>Difficulty: {questionTemplate.difficulty}</h3>
            
            <div id="description">
                <h3>Description</h3>
                {questionTemplate.description.map((str, index) => <p id={index}>{str}</p>)}
            </div>

            <div id="examples">
                {
                    questionTemplate.examples.map(ex => {
                        return (
                            <Example 
                            key={index}
                            count={index++}
                            input={ex[0]}
                            output={ex[1]}
                            explain={ex[2]}
                        />
                        )
                    })
                }
            </div>
            <div id='constraints'>
                <h3>Constraints:</h3>
                <ul>
                    {questionTemplate.constraints.map(cons => <li>{cons}</li>)}
                </ul>
            </div>
        </div>
    )
}