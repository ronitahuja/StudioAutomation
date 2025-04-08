const LLMService = require('../services/llm.service');
const llmService=new LLMService();

class CurlHandlerService{
    async extractParamsfromCurl(curl){
        const prompt = `
           
            }

            our current curl request is : ${curl} , you need to process this curl request according to the above rules and give only json.
            Dont give json output in between backticks
        `;
        const segregatedParams = await llmService.queryLLM(prompt);
        console.log(segregatedParams);
        return segregatedParams;
    }
    async converter(params){
        const format = {
          paramName: "",
          paramType: "",
          mandatory: "",
          sensitive: "",
          variableName: "",
          description:""
        };
        const prompt=`

        `
        const response=llmService.queryLLM(prompt);
        return response;
    }

    async convertInDesiredFormat(encodedParams){
        try{
            const parsedEncodedParams=JSON.parse(encodedParams);
            let connectionLevelParams,transactionLevelParams;
            Object.keys(parsedEncodedParams).forEach((entry)=>{
                if(entry.toLowerCase()==="connectionlevelparams")connectionLevelParams=parsedEncodedParams[entry];
                else transactionLevelParams=parsedEncodedParams[entry];
            });
            console.log(connectionLevelParams,transactionLevelParams);
            return {
                ConnectionLevel:this.converter(connectionLevelParams),
                TransactionLevel:this.converter(transactionLevelParams)
            }
        }
        catch(err){
            console.log(err);
        }
    }
};
module.exports = CurlHandlerService;