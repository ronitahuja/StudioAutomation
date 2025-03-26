const LLMService = new require("../services/llm.service");
const axios = require("axios");

class autoComplete {
  constructor(model = "llama-3.3-70b-specdec") {
    this.llmService = new LLMService(model);
  }
  async completeCode(req, res, next) {
    try {
      const queryObj = req.body;
      const result = await axios.post(
        `${process.env.BACKEND_URL}/functions/search`,
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
You are an advanced AI-powered code assistant that completes ${queryObj.language} scripts intelligently, just like GitHub Copilot. Your job is to **predict the most appropriate next lines of code** based on context and the retrieved SDK functions.

### **Context**
- Application Name: ${queryObj.applicationName}
- App Action Name: ${queryObj.appActionName}
- Language: ${queryObj.language}
- **Existing Code (DO NOT REPEAT, only continue)**:
\`\`\`
${queryObj.currentCode}
\`\`\`

### **Available SDK Functions**
You can use the following SDK functions when necessary:
${parsedResult}

---

### **Completion Rules**
1. **Continue Writing from the Last Line**: Do **not** repeat the existing code. Start from where it left off.
2. **Think Like a Developer**: Predict the next logical lines based on the given code context.
3. **Use SDK Functions When Relevant**: If the next part of the code requires an SDK function, pick the best one from the list.
4. **No Random Code**: Only suggest meaningful code that makes sense in the context.
5. **No Code Blocks (\`\`\`) or Extra Text**: Return only raw code.
6. **Avoid Unnecessary Imports or Duplications**: Assume all required imports are already present.
7. **Do not provide any additional information or context , do not provide what you think , only provide the code**

---

### **Now, Continue the Code Thoughtfully:**
`;

      const generatedCode = await this.llmService.queryLLM(prompt);
      res.status(200).json({ code: generatedCode });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = autoComplete;
