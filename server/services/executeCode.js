import axios from 'axios';

const pistonUrl = "https://emkc.org/api/v2/piston";

const API = axios.create({
    baseUrl: pistonUrl
});

export const executeCode = async(language = 'javascript', sourceCode) => {
    const response = await API.post("/execute", {
        language: language,
        version: "18.15.0",
        files: [
            {
                content: sourceCode,
            },
        ],
    });

    return response.data;
}