const express = require('express');

const {AppController} =  require('../../controllers');

const AppRouter = express.Router();

//routes
AppRouter.get('/ping',AppController.pingAppController);
AppRouter.post('/',AppController.createApp);


module.exports = AppRouter;