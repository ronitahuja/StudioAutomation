const ollama = require("ollama");

class LLMService {
  constructor(model = "llama3.1:8b") {
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
    You are a highly efficient AI code generator, capable of writing optimized and structured code.
    Generate a code snippet using the retrieved SDK functions.
    
    Here are the retrieved SDK functions:
    ${parsedResult}
    
    Utilize the query: "${
      queryObj.query
    }" to determine the intent and required operations.
    Use the following parameters:
    - Connection Level Parameters: ${JSON.stringify(
      queryObj.connectionLevelParamFields,
      null,
      2
    )}
    - Transaction Level Parameters: ${JSON.stringify(
      queryObj.transactionLevelParamFields,
      null,
      2
    )}
    
    Ensure the generated Python code follows best practices, is syntactically correct, and adheres to our internal SDK standards.
    Validate mandatory parameters before execution.
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
        }),
      });

      const data = await response.json();
      return data.response;
    }
  }
}

module.exports = LLMService;
