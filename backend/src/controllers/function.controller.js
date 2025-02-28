const { FunctionService } = require("../services");
const { FunctionRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const functionService = new FunctionService(new FunctionRepository());

function pingFunctionController(req, res) {
  return res.json({ message: "Function Controller is up" });
}
async function insertFunctions(req, res, next) {
  try {
    const newFunctions = await functionService.insertFunctions(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "successfully inserted all functions",
      error: {},
      data: newFunctions,
    });
  } catch (error) {
    next(error);
  }
}
async function vectorSearch(req, res, next) {
  try {
    const { query } = req.body;
    if (!query) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Query is required" });
    }
    const result = await functionService.vectorSearch(query);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "successfully searched",
      error: {},
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  pingFunctionController,
  insertFunctions,
  vectorSearch,
};
