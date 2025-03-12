const express=require('express');
const { AnalysisController } = require('../../controllers');

const AnalysisRouter=express.Router();

AnalysisRouter.post('/update',AnalysisController.updateAnalysis);
AnalysisRouter.post('/getanalysis',AnalysisController.getAnalysis);
AnalysisRouter.get('/getallanalysis',AnalysisController.getAllAnalysis);

module.exports=AnalysisRouter;