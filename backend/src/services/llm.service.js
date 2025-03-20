const Groq = require("groq-sdk");
const dotenv = require("dotenv");
const { spawn } = require('child_process');
dotenv.config();

const groq = new Groq({
  apiKey: process.env.MY_GROQ_API_KEY,
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

            const python = spawn(
              process.env.VENV_PATH,
              [
                process.env.PYTHON_SCRIPT_PATH,
                data,
              ]
            );

            let dataBuffer = '';  

            python.stdout.on('data', (chunk) => {
                dataBuffer += chunk.toString();  
            });

            python.stderr.on('data', (data) => {
                console.error(`Python Error: ${data.toString()}`);
            });

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
