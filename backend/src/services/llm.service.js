  const ollama = require("ollama");

  class LLMService {
    constructor(model = "deepseek-r1:1.5b") {
      this.model = model;
      this.history = "";
    }
    async queryLLM(queryObj) {
      
      let res = await fetch("http://localhost:3000/api/v1/functions/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryObj.query,
        }), 
      });
      
      res = await res.json();
      if (res) {
        res = res.data;
        const parsedResult = res.map((data, i) => {
          let temp = {};
          temp.name = data.name;
          temp.description = data.description;
          temp.syntax = data.syntax;
          temp.parameters = data.parameters;
          temp.return_value = data.return_value;
          temp.example = data.example;
          return JSON.stringify(temp);
        });

        const prompt = `
      You are a highly efficient AI code generator, specialized in generating SDK-compliant Python scripts. Your sole task is to generate structured, syntactically correct, and optimized Python code based on the retrieved SDK functions.

  ---
  ### **Strict Rules:**
  1. **Only Generate Code**: Do NOT provide explanations, alternative responses, or opinions.
  2. **Reject Unrelated Queries**: If the user's query is NOT directly related to script generation using the SDK, respond with the following exact message:
    **"Error: This assistant only supports generating SDK-based scripts. Please provide a relevant script generation query."**
  3. **Do NOT Hallucinate Functions**: Only use the following SDK functions:
    ${parsedResult}
  4. You should use the function retrieved to generate the script. you should not create your own functions.


  ---
  ### **User Query:**
  "${queryObj.query}"

  ---
  ### **Parameter Constraints:**
  - **Connection-Level Parameters**: ${JSON.stringify(queryObj.connectionLevelParamFields, null, 2)}
  - **Transaction-Level Parameters**: ${JSON.stringify(queryObj.transactionLevelParamFields, null, 2)}

  ---
  ### **Important Validation Rules:**
  ✅ Validate all **mandatory parameters** before execution.  
  ✅ Ensure efficient, readable, and maintainable Python code.  
  ✅ Use proper **error handling** and logging.  
  ✅ If necessary, assume default values but do NOT invent non-existent parameters.  

  ---
  ### **Final Instruction:**
  **ONLY generate a valid Python script OR reject the request with the predefined error message.**
  DO NOT generate explanations, opinions, or unrelated content.

      `;
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.model,
            prompt: prompt,
            stream: false,
            temperature : 0.2
          }),
        });
        const data = await response.json();
        console.log(data.response);
        return data.response;
      }
    }
  }

  module.exports = LLMService;
