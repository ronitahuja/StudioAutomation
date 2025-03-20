const LLMService=new require("../services/llm.service");
const axios = require("axios");

class autoComplete {
  constructor(model = "llama-3.3-70b-specdec") {
    this.llmService = new LLMService(model);
  }
  async completeCode(req, res, next) {
    try {
      const queryObj = req.body;
      const result = await axios.post(
        "http://localhost:3000/api/v1/functions/search",
        { query: queryObj.currentCode },
        { headers: { "Content-Type": "application/json" } }
      );
      let parsedResult;
      if (result.data && result.data.data) {
        parsedResult = result.data.data.map((data) => {
          return JSON.stringify({
            name: data.name,
            description: data.description,
            syntax: data.syntax,
            parameters: data.parameters,
            return_value: data.return_value,
            example: data.example,
          });
        });
      }
      const prompt = `
            You are a highly efficient AI code generator, specialized in generating SDK-compliant ${queryObj.language} scripts. Your sole task is to generate structured, syntactically correct, and optimized Python code based on the retrieved SDK functions ${parsedResult}.
            here is the application name : ${queryObj.applicationName}
            here is the appAction name : ${queryObj.appActionName}
            here is the language : ${queryObj.language}
            here is the current code : ${queryObj.currentCode}
            ---
            ### **Strict Rules:**
            1. **Only Generate Code**: Do NOT provide explanations, alternative responses, or opinions.
            2. **Use SDK Functions**: Only use the following SDK functions:
            ${parsedResult}
            3. **Do NOT Hallucinate Functions**: Only use the function retrieved to generate the script.
            4. Only give the remaining code to complete the current code.
            5. Do not use   \`\`\`code\`\`\` syntax. just give the code without embedding it in between \`\`\`.
            6. Just give the code that completes the current code. Dont repeat the current code.
            7. Do not provide any additional information or context.
            8. Do not provide any additional comments.
            ---
            `;
      const generatedCode = await this.llmService.queryLLM(prompt);
      res.status(200).json({ code: generatedCode });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = autoComplete;