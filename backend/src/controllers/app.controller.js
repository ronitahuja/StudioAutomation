const {StatusCodes} = require("http-status-codes");
const {AppService} = require("../services");
const {AppRepository} = require("../repositories")

const appService = new AppService(new AppRepository());


async function pingAppController(req,res){
    return res.json({message:"App controller is up"})
}
async function createApp(req,res){
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

module.exports ={
    pingAppController,
    createApp
}
