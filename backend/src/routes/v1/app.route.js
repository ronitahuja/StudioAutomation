const express = require('express');

const {AppController} =  require('../../controllers');

const AppRouter = express.Router();

//routes
AppRouter.get('/ping',AppController.pingAppController);
AppRouter.post('/',AppController.createApp);
AppRouter.get('/appCategories',AppController.getAppCategory)
AppRouter.get('/authenticationType',AppController.getAuthenticationType)


module.exports = AppRouter;