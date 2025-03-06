const { generateEmbedding } = require("./embedding.service");

class FunctionService{
    constructor(functionRepository){
        this.functionRepository = functionRepository;
    }
    async insertFunctions(functionsData){
        const functionDocs = await Promise.all(
            functionsData.map(async (func)=>{
                const functionText =`
                Function : ${func.name}
                Description : ${func.description}
                Syntax : ${func.syntax}
                Parameters : ${JSON.stringify(func.parameters)}
                Return Type : ${func.return_value}
                Example : ${func.example}
                `
                const embedding = await generateEmbedding(functionText);

                return {
                    name: func.name,
                    description: func.description || null,
                    syntax: func.syntax || null, 
                    parameters: func.parameters || [],
                    return_value: func.return_value || null,
                    example: func.example || null,
                    embedding, 
                }
            })
        )
       
        
        const newFunctions = await this.functionRepository.insertFunctions(functionDocs);
        return newFunctions;
    }

    async vectorSearch(query){
        const queryEmbedding = await generateEmbedding(query);
        const topK = 5;
        const results = await this.functionRepository.vectorSearch(queryEmbedding, topK);
        return results;
    }
}
module.exports = FunctionService;