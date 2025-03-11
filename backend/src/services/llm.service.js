const Groq = require("groq-sdk");
const dotenv = require("dotenv");
const { spawn } = require('child_process');
dotenv.config();

const groq = new Groq({
    apiKey: process.env.DARWIN_GROQ_API_KEY,
});

class LLMService {
    constructor(model = "deepseek-r1-distill-qwen-32b") {
        this.model = model;
    }
    async queryLLM(systemPrompt) {
        try {
            const prompt = systemPrompt;
            const response = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: this.model,
                temperature: 1,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null,
            });
            const generatedCode = response.choices[0]?.message?.content || "no output";
            return generatedCode;
        } catch (error) {
            console.error("Error querying LLM:", error);
            throw error;
        }
    }

    async generateAppActionsScript(queryObj) {
        try {
            const { link, query, model } = queryObj;

            const data = JSON.stringify({ model, link, query });

            // Spawn Python process
            const python = spawn(
                '/home/harsh.d/Desktop/StudioAutomation/scrape/bin/python3',
                ['/home/harsh.d/Desktop/StudioAutomation/backend/src/services/appGenerationRequirementFetchingScript.py', data]
            );

            let dataBuffer = '';  // Buffer for accumulating stdout data

            // Capture stdout
            python.stdout.on('data', (chunk) => {
                dataBuffer += chunk.toString();  // Accumulate chunks
            });
            console.log("Data Buffer=>", dataBuffer);

            // Capture stderr
            python.stderr.on('data', (data) => {
                console.error(`Python Error: ${data.toString()}`);
            });

            // Handle process close event
            python.on('close', (code) => {
                console.log(`Python process exited with code ${code}`);

                try {
                    const trimmedData = dataBuffer.trim();
                    const jsonResponse = JSON.parse(trimmedData);

                    if (jsonResponse.status === 'error') {
                        console.error('Python Error:', jsonResponse.message);
                    } else {
                        console.log('Scraping Data:', jsonResponse.data);
                    }
                } catch (error) {
                    console.error('Failed to parse JSON response:', error.message);
                    console.error('Raw Data Received:', dataBuffer);
                }
            });
        } catch (err) {
            console.error('Error in generateAppActionsScript:', err);
            throw err;
        }
    }

}

module.exports = LLMService;
