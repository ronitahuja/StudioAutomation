const { StatusCodes } = require("http-status-codes");

const { AppActionService } = require("../services");
const { AppActionRepository } = require("../repositories");
const appActionService = new AppActionService(new AppActionRepository());

async function pingAppActionController(req, res) {
  return res.json(StatusCodes.OK, {
    message: "App Action Controller is working",
  });
}

async function createAppActions(req, res, next) {
  try {
    const newAppaction = await appActionService.createAppAction(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "App Action Created Successfully",
      data: newAppaction,
      err: {},
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  pingAppActionController,
  createAppActions,
};
