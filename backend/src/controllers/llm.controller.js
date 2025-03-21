const LLMService = require("../services/llm.service");
const axios = require("axios");

class LLMController {
    constructor(model = "deepseek-r1-distill-qwen-32b") {
        this.llmService = new LLMService(model);
    }
    async queryLLM(req, res, next) {
        try {
            const queryObj = req.body;
            const result = await axios.post(
                "http://localhost:3000/api/v1/functions/search",
                { query: queryObj.query },
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
                const prompt = `
        You are a highly efficient AI code generator, specialized in generating SDK-compliant  scripts. 
        Your sole task is to generate structured, syntactically correct, and optimized ${
          queryObj.language
        } code based on the retrieved SDK functions.
        here is the application name : ${queryObj.applicationName}
        here is the appAction name : ${queryObj.appActionName}  
        current code is: ${queryObj.currentCode}
        ---
        ### **Strict Rules:**
        1. **Only Generate Code**: Do NOT provide explanations, alternative responses, or opinions.
  
        3. **Do NOT Hallucinate Functions**: Only use the following SDK functions:
          ${parsedResult}
        4. You should use the function retrieved to generate the **script**. you should not create your own functions.
        5. Do not use   \`\`\`code\`\`\` syntax. just give the code without embedding it in between \`\`\`.
        6. Just give the code that completes the current code. Dont repeat the current code.
        7. Do not provide any additional information or context.
        8. Do not provide any additional comments.
        ---
        ### **User Query:**
        "${queryObj.query}"

      ---
      ### **Parameter Constraints:**
      - **Connection-Level Parameters**: ${JSON.stringify(
        queryObj.connectionLevelParamFields,
        null,
        2
      )}
    - **Transaction-Level Parameters**: ${JSON.stringify(
      queryObj.transactionLevelParamFields,
      null,
      2
    )}
    ---
    ### **Important Validation Rules:**
    Validate all **mandatory parameters** before execution.  
    Ensure efficient, readable, and maintainable ${queryObj.language} code.  
    Use proper **error handling** and logging.  
    If necessary, assume default values but do NOT invent non-existent parameters.  
    ---
    ### **Final Instruction:**

    DO NOT generate explanations, opinions, or unrelated content.
    dont include <think> </think> tags in the response.
    No need to import the SDK functions, just use them directly in the code.
    for eg: you dont need to write "import DBSResponse" because the functions that are coming in  ${parsedResult} are already imported.
    also dont give any explanation or <think> </think> tags in the response.`;

    console.log("prompt", prompt);

                const response = await this.llmService.queryLLM(prompt);

                return res.status(200).json({
                    success: true,
                    message: "successfully queried",
                    error: {},
                    data: response,
                });
            }
        } catch (err) {
            next(err);
        }
    }
    async generateAppActionsScript(req, res, next) {
        try {
            const queryObj = req.body;
            const response = await this.llmService.generateAppActionsScript(queryObj);

            return res.status(200).json({
                success: true,
                message: "successfully generated app, app Action and Script",
                error: {},
                data: response,
            });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = LLMController;
