const express = require("express");

const { AppActionController } = require("../../controllers");

const AppActionRouter = express.Router();

AppActionRouter.get("/ping", AppActionController.pingAppActionController);
AppActionRouter.post("/createAppActions", AppActionController.createAppActions);

module.exports = AppActionRouter;
