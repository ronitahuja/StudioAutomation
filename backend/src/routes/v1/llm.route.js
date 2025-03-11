const express = require("express");
const { LLMController } = require("../../controllers");
const LLMRouter = express.Router();

LLMRouter.post("/query", (req, res, next) => {
  const { model } = req.body;
  const llmControllerInstance = new LLMController(model);
  return llmControllerInstance.queryLLM(req, res, next);
});
LLMRouter.post("/generate",(req,res,next)=>{
  const { model } = req.body;
  const llmControllerInstance = new LLMController(model);
  return llmControllerInstance.generateAppActionsScript(req,res,next);
})

module.exports = LLMRouter;
