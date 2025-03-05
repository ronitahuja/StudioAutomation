const {StatusCodes} = require("http-status-codes");
const {AppService} = require("../services");
const {AppRepository} = require("../repositories")

const appService = new AppService(new AppRepository());


async function pingAppController(req,res){
    return res.json({message:"App controller is up"})
}
async function createApp(req,res,next){
    try{
        const app = await appService.createApp(req.body);
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully created app",
            error:{},
            data : app
        })
    }
    catch(err){
        next(err);
    }
}

async function getAppCategory(req,res,next){
    try{
        const appCategories = await appService.getAppCategory();
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully fetched app categories",
            error:{},
            data : appCategories
        })
    }
    catch(err){
        next(err);
    }
}

async function getAuthenticationType(req,res,next){
    try{
        const authenticationTypes = await appService.getAuthenticationType();
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully fetched authenticationTypes",
            error:{},
            data : authenticationTypes
        })
    }
    catch(err){
        next(err);
    }
}


module.exports ={
    pingAppController,
    createApp,
    getAppCategory,
    getAuthenticationType
}
