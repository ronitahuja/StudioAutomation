const express = require('express');

const {AppController} =  require('../../controllers');

const AppRouter = express.Router();

//routes
AppRouter.get('/ping',AppController.pingAppController);
AppRouter.get('/',AppController.getAllApps);
AppRouter.post('/',AppController.createApp);
AppRouter.get('/appCategories',AppController.getAppCategory)
AppRouter.get('/authenticationType',AppController.getAuthenticationType)
AppRouter.get('/appNames',AppController.getAppNames);
AppRouter.get('/appnames/:appName',AppController.getConnectionLevelParams);


module.exports = AppRouter;