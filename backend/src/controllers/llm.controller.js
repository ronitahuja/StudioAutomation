const LLMService = require("../services/llm.service");

class LLMController {
  constructor(model) {
    this.llmService = new LLMService(model);
  }
  async queryLLM(req, res, next) {
    try {
      const queryObj = req.body;
      const response = await this.llmService.queryLLM(queryObj);
      // const evaluatedResponse= await this.llmService.checkResponse(queryObj, response);

      // uncomment this if u want to enable response chaining

      // return res.status(200).json({
      //   success: true,
      //   message: "successfully queried",
      //   error: {},
      //   data: evaluatedResponse,
      // });

      return res.status(200).json({
        success: true,
        message: "successfully queried",
        error: {},
        data: response,
      });

    } catch (err) {
      next(err);
    }
  }
}

module.exports = LLMController;
