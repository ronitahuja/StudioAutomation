const {BadRequest} = require("../errors/badRequest.error")
const { AnalysisRepository } = require('../repositories');
const {AnalysisService}=require('../services');

const analysisService=new AnalysisService(new AnalysisRepository());

async function updateAnalysis(req,res,next){
    try{

        let {modelName,like}=req.body;
        // Check for missing or invalid fields
        if (!modelName) {
            throw new BadRequest("modelName", "The 'modelName' field is required.");
        }
        if (typeof like !== "boolean") { 
            throw new BadRequest("like", "The 'like' field must be a boolean value (true/false).");
        }
        const data= await analysisService.updateAnalysis(modelName,like);
        return res.status(200).json({
                success:true,
                error:{},
                data : data
            });
    }
    catch(err){
        console.log("error in analysis controller");
        next(err);
    }
}
async function getAnalysis(req,res,next){
    try {
      let { modelName } = req.body;
      if (!modelName) {
        throw new BadRequest("modelName", "The 'modelName' field is required.");
    }
      const data = await analysisService.getAnalysis(modelName);
      return res.status(200).json({
        success: true,
        error: {},
        data: data,
      });
    } catch (err) {
      console.log("error in analysis controller");
      next(err);
    }
}
async function getAllAnalysis(req,res,next){
    try {
      const data = await analysisService.getAllAnalysis();
      return res.status(200).json({
        success: true,
        error: {},
        data: data,
      });
    } catch (err) {
      console.log("error in analysis controller");
      next(err);
    }
}

module.exports={
    updateAnalysis,
    getAnalysis,
    getAllAnalysis
}