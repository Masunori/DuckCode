import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // middleware to parse json() bodies

const PORT = process.env.PORT || 5000;

const pistonUrl = "https://emkc.org/api/v2/piston";

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// PistonAPI code execution request
app.post('/execute', async (req, res) => {
    const { code, language, version } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are reqwuired!' });
    }

    const payload = {
        language: language,
        version: version,
        files: [
            {
                content: code,
            },
        ],
    };

    try {
        const response = await fetch(pistonUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.error) {
            console.error('Piston API error:', data.error)
            return res.status(400).json({ error: 'Internal server error!' });
        }

        res.json({ output: data.output });
    } catch (error) {
        console.error('Error executing code: ', error);
        res.status(500).json({ error: 'Internal server error!' });
    }
});

// Judge0 CE testing
// const judge0CEUrl = 'https://judge0-ce.p.rapidapi.com';
// app.post('/submission', async (req, res) => {
//     const { code, language, stdin = '', expectedOutput = '' } = req.body;

//     const requestBody = {
//         source_code: code,
//         language_id: language,
//         stdin: stdin,
//         expected_output: expectedOutput,
//     };

//     const url = `${judge0CEUrl}/submissions/?base64_encoded=false&wait=false`;

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Auth-Token': process.env.X_RAPIDAPI_KEY,
//             },
//             body: JSON.stringify(requestBody),
//         });

//         if (!response.ok) {
//             throw new Error('Error creating submission!');
//         }
        
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error('Error forwarding request to Judge0:', error);
//         res.status(500).json({ error: 'Failed to submit code to Judge0!' });
//     }
// });

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
