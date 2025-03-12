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
async function getAllApps(req,res,next){
    try{
        const allApps = await appService.getAllApps();
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully fetched all apps",
            error:{},
            data : allApps
        })
    }
    catch(err){
        next(err);
    }
}
async function getApp(req,res,next){
    try{
       
        const app = await appService.getApp(req.params.appName);
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully fetched app",
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

async function getAppNames(req,res,next){
    try{
        const appNames = await appService.getAppNames();
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully fetched application Names",
            error:{},
            data : appNames
        })
    }
    catch(err){
        next(err);
    }
}

async function getConnectionLevelParams(req,res,next){
    try{
        
        const {appName} = req.params;
        const connectionLevelParams = await appService.getConnectionLevelParams(appName);
        
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully fetched connection Level Param fields",
            error:{},
            data : connectionLevelParams
        })
    }
    catch(err){
        next(err);
    }
}

async function updateApp(req,res,next){
    try{
        const updatedApp = await appService.updateApp(req.body);
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully updated app",
            error:{},
            data : updatedApp
        })
    }
    catch(err){
        next(err);
    }
}
async function deleteApp(req,res,next){
    try{
        const {appName}= req.params;
        const deletedApp = await appService.deleteApp(appName);
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"succesfully deleted app",
            error:{},
            data : deletedApp
        })
    }catch(err){
        next(err);  
    }
}

module.exports ={
    pingAppController,
    createApp,
    getAppCategory,
    getAuthenticationType,
    getAppNames,
    getConnectionLevelParams,
    getAllApps,
    getApp,
    updateApp,
    deleteApp
}
