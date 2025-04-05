const { StatusCodes } = require('http-status-codes');
const {CurlHandlerService} = require('../services');

const curlHandlerService = new CurlHandlerService();


async function pipeline(req,res,next){
    try{
        console.log(req.body.curl);
        const params = await curlHandlerService.extractParamsfromCurl(req.body.curl);
        // const requiredFormat = await curlHandlerService.convertInDesiredFormat(params);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "successfully fetched all params",
            error: {},
            // data: requiredFormat,
            data:params
        });
    }
    catch(err){
        next(err);
    }
    
}


module.exports = {
    pipeline
}