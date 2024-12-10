export class QuestionTemplate {
    title;
    input;
    output;
    difficulty;
    description;
    exampleObject;
    constraints;

    constructor(title, difficulty, input, output, description, examples, constraints) {
        this.title = title;
        this.difficulty = difficulty;
        this.input = input.split('\n');
        this.output = output.split('\n');
        this.description = description.split('\n');
        this.exampleObject = this.breakExample(examples);
        this.constraints = constraints.split('\n');
    }

    /**
     * Breaks an example string fetched from PostgreSQL into an object literal.
     * 
     * @param {string} example - The example string, separated by '\n' 
     * @returns an object literal containing three keys: input, output, explanation
     */
    breakExample(example) {
        const exampleObject = {
            input: [],
            output: [],
            explanation: []
        }

        let currentKey = 'input';
        example.split('\n').forEach(str => {
            if (str === 'Output') {
                currentKey = 'output';
            } else if (str === 'Explanation') {
                currentKey = 'explanation';
            } else if (str !== 'Input') {
                exampleObject[currentKey].push(str);
            }
        });

        return exampleObject;
    }
}

function Example( {exampleObject} ) {
    return (
        <div className="example">
            <div className="decorator-line"></div>
            <div className="example-content">
                <h4>Input:</h4>
                {exampleObject.input.map((i, index) => <span><code key={index}>{i}</code></span>)}
                <h4>Output:</h4>
                {exampleObject.output.map((o, index) => <span><code key={index}>{o}</code></span>)}
                <h4>Explanation:</h4>
                {exampleObject.explanation.map((e, index) => <p key={index}>{e}</p>)}
            </div>
        </div>
    )
}

export default function Question({ questionTemplate }) {
    // console.log(JSON.stringify(questionTemplate.exampleObject, null, 4));

    return (
        <div id="question">
            <h1>{questionTemplate.title}</h1>
            <h3>Difficulty: {questionTemplate.difficulty}</h3>
            
            <div id="description">
                <h3>Description</h3>
                {questionTemplate.description.map((str, index) => <p id={index}>{str}</p>)}
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
            <Example exampleObject={questionTemplate.exampleObject} />
            <div id='constraints'>
                <h3>Constraints:</h3>
                <ul>
                    {questionTemplate.constraints.map(cons => <li>{cons}</li>)}
                </ul>
            </div>
        </div>
    )
}