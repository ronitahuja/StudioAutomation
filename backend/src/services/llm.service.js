const Groq = require("groq-sdk");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({
  apiKey: process.env.DARWIN_GROQ_API_KEY,
});

class LLMService {
  constructor(model = "deepseek-r1-distill-qwen-32b") {
    this.model = model;
  }
  async queryLLM(queryObj) {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/functions/search",
        { query: queryObj.query },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data && res.data.data) {
        const parsedResult = res.data.data.map((data) => {
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
  You are a highly efficient AI code generator, specialized in generating SDK-compliant Python scripts. Your sole task is to generate structured, syntactically correct, and optimized Python code based on the retrieved SDK functions.
  here is the application name : ${queryObj.applicationName}
  here is the appAction name : ${queryObj.appActionName}  
  here is the language : ${queryObj.language}
  ---
  ### **Strict Rules:**
  1. **Only Generate Code**: Do NOT provide explanations, alternative responses, or opinions.
  
  3. **Do NOT Hallucinate Functions**: Only use the following SDK functions:
    ${parsedResult}
  4. You should use the function retrieved to generate the script. you should not create your own functions.


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
  Ensure efficient, readable, and maintainable Python code.  
  Use proper **error handling** and logging.  
  If necessary, assume default values but do NOT invent non-existent parameters.  

  ---
  ### **Final Instruction:**

  DO NOT generate explanations, opinions, or unrelated content.
  dont include <think> </think> tags in the response.
  No need to import the SDK functions, just use them directly in the code.
  for eg: you dont need to write "import DBSResponse" because the functions that are coming in  ${parsedResult} are already imported.
  also dont give any explanation or <think> </think> tags in the response.


`;
console.log("prompt",prompt);

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
      }
    } catch (error) {
      console.error("Error querying LLM:", error);
      throw error;
    }
  }
}
module.exports = LLMService;
