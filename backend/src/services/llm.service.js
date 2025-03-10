// const axios = require("axios");

// class LLMService {
//   constructor(model = "deepseek-r1:1.5b") {
//     this.model = model;
//   }

//   async queryLLM(queryObj) {
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/v1/functions/search",
//         { query: queryObj.query },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (res.data && res.data.data) {
//         const parsedResult = res.data.data.map((data) => {
//           return JSON.stringify({
//             name: data.name,
//             description: data.description,
//             syntax: data.syntax,
//             parameters: data.parameters,
//             return_value: data.return_value,
//             example: data.example,
//           });
//         });

//         const prompt = `
// You are an AI-based SDK code generator capable of producing optimized Python, R, and Node.js scripts based on the provided SDK functions.

// ---
// ### **Strict Instructions:**
// 1. **Only Generate Code**: Do not provide explanations, opinions, or alternative solutions.
// 2. **Reject Irrelevant Queries**: Respond with **"Error: This assistant only supports SDK-based script generation. Please provide a valid query."** if the query is unrelated.
// 3. **Function Restriction**: Use only the following SDK functions:
// ${parsedResult}
// 4. **No Custom Functions**: Use only the retrieved SDK functions — no self-created functions.

// ---
// ### **User Query:**
// "${queryObj.query}"

// ---
// ### **Parameter Constraints:**
// - **Connection-Level Parameters**: ${JSON.stringify(
//           queryObj.connectionLevelParamFields,
//           null,
//           2
//         )}
// - **Transaction-Level Parameters**: ${JSON.stringify(
//           queryObj.transactionLevelParamFields,
//           null,
//           2
//         )}

// ---
// ### **Validation Rules:**
// Include all **mandatory parameters** before execution.
// Produce readable, maintainable, and optimized code.
// Implement proper **error handling** and logging.
// Use default values only when explicitly allowed.
// Do not invent parameters or functions.

// ---
// ### **Final Instruction:**
// Generate only the required script or return the predefined error message. No additional content is allowed.
// `;

//         const response = await fetch("http://localhost:11434/api/generate", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             model: this.model,
//             prompt,
//             stream: false,
//             temperature: 0.2,
//           }),
//         });
//         const data = await response.json();
//         console.log(data.response);
//         return data.response;
//       }
//     } catch (error) {
//       console.error("Error querying LLM:", error);
//       throw error;
//     }
//   }

//   async checkResponse(queryObj, response) {
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/v1/functions/search",
//         { query: queryObj.query },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (res.data && res.data.data) {
//         const parsedResult = res.data.data.map((data) => {
//           return JSON.stringify({
//             name: data.name,
//             description: data.description,
//             syntax: data.syntax,
//             parameters: data.parameters,
//             return_value: data.return_value,
//             example: data.example,
//           });
//         });

//         const prompt = `
// You are an AI-based SDK code evaluator, verifying Python, R, and Node.js scripts against user queries and SDK constraints.

// ---
// ### **Evaluation Guidelines:**
// 1. **Strict SDK Compliance**: Ensure only the following SDK functions are used:
// ${parsedResult}

// 2. **Query Adherence**: Confirm that the generated script meets the user query:
// "${queryObj.query}"

// 3. **Parameter Validation:**
// - **Connection-Level Parameters**: ${JSON.stringify(
//           queryObj.connectionLevelParamFields,
//           null,
//           2
//         )}
// - **Transaction-Level Parameters**: ${JSON.stringify(
//           queryObj.transactionLevelParamFields,
//           null,
//           2
//         )}

// 4. **Validation Checklist:**
// All mandatory parameters must be included.
// Only the retrieved SDK functions should be used.
// No hallucinated parameters or functions.
// Best practices must be followed (readability, error handling, logging).
// No additional text — only the corrected code.

// 5. **Error Messages:**
// - Valid Code: **"Valid Response"**
// - Invalid Code: **"Invalid Response"** with a list of issues.

// ---
// ### **User Query:**
// "${queryObj.query}"

// ---
// ### **Generated Code:**
// \`\`\`python or node or R
// ${response}
// \`\`\`

// ---
// ### **Final Instruction:**
// Return only the corrected code. No explanations, opinions, or alternative solutions.
// `;

//         const result = await fetch("http://localhost:11434/api/generate", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             model: this.model,
//             prompt,
//             stream: false,
//             temperature: 0.2,
//           }),
//         });
//         const data = await result.json();
//         console.log(data.response);
//         return data.response;
//       }
//     } catch (error) {
//       console.error("Error checking response:", error);
//       throw error;
//     }
//   }
// }

// module.exports = LLMService;

const Groq = require("groq-sdk");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({
  apiKey: process.env.DARWIN_GROQ_API_KEY,
});


class LLMService {
  constructor(model = "deepseek-r1-distill-qwen-32b") {
    // this.model = model; 
    this.model = "deepseek-r1-distill-qwen-32b";
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
  - **Connection-Level Parameters**: ${JSON.stringify(queryObj.connectionLevelParamFields, null, 2)}
  - **Transaction-Level Parameters**: ${JSON.stringify(queryObj.transactionLevelParamFields, null, 2)}

  ---
  ### **Important Validation Rules:**
  Validate all **mandatory parameters** before execution.  
  Ensure efficient, readable, and maintainable Python code.  
  Use proper **error handling** and logging.  
  If necessary, assume default values but do NOT invent non-existent parameters.  

  ---
  ### **Final Instruction:**

  DO NOT generate explanations, opinions, or unrelated content.

`;

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