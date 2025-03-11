const Groq = require("groq-sdk");
const dotenv = require("dotenv");
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
      const generatedCode =
        response.choices[0]?.message?.content || "no output";
      console.log(generatedCode);
      return generatedCode;
    } catch (error) {
      console.error("Error querying LLM:", error);
      throw error;
    }
  }
}
module.exports = LLMService;
