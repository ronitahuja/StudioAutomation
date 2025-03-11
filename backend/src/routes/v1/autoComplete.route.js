const express = require("express");
const { AutoCompleteController } = require("../../controllers");
const AutoCompleteRouter = express.Router();

// {
    // currectCode
    // applicationName
    // language
    // appActionName
// }

AutoCompleteRouter.post("/query", (req, res, next) => {
  const { model } = "llama-3.3-70b-specdec";
  const autoCompleteControllerInstance= new AutoCompleteController(model);
  return autoCompleteControllerInstance.completeCode(req, res, next);
});

module.exports = AutoCompleteRouter;
