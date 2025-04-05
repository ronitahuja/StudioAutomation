const LLMService = require('../services/llm.service');
const llmService=new LLMService();

class CurlHandlerService{
    async extractParamsfromCurl(curl){
        const prompt = `
            You are an AI assistant. Respond strictly in JSON format without any extra text. 
            You will be given a curl request and you need to find that the connection level parameters and transaction level parametrs.
            connection level parameters are the parameters which are mentioned inside the header.these parameters remain constant and doesnt change accross the whole lifecycle of the application and are defined only once. connection level parameters can be inside url also , they can be inside {};
            Transaction Level Parameters are the parameters which are defined inside the data . These parameters are specific to the app action . 

            for example :
            curl --request POST \
            --url https://api.cal.com/v2/oauth-clients/{clientId}/users \
            --header 'Content-Type: application/json' \
            --header 'x-cal-secret-key: <x-cal-secret-key>' \
            --data '{
            "email": "alice@example.com",
            "name": "Alice Smith",
            "timeFormat": 12,
            "weekStart": "Monday",
            "timeZone": "America/New_York",
            "locale": "en",
            "avatarUrl": "https://cal.com/api/avatar/2b735186-b01b-46d3-87da-019b8f61776b.png"
            }'
            in this curl , 'x-cal-secret-key' ,'clientId' are connection level parameters.
            'email','name','timeFormat','weekStart','timeZone','locale','avatarUrl' are transaction level parameters;
            
            the output should be in this format:

            {
                "connectionlevelparams": {
                    'x-cal-secret-key': <x-cal-secret-key>,
                    'clientId': clientId
                },
                "transactionlevelparams" ; {
                    'email':'alice@example.com',
                    'name' : 'Alice Smith',
                    'timeFormat': 12.
                    'weekStart': 'Monday',
                    'timeZone':'America/New_York',
                    'locale': 'en';
                    'avatarUrl' : 'https://cal.com/api/avatar/2b735186-b01b-46d3-87da-019b8f61776b.png'
                }
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