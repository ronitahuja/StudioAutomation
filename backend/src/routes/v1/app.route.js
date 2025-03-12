const express = require('express');

const {AppController} =  require('../../controllers');

const AppRouter = express.Router();

//routes
AppRouter.get('/ping',AppController.pingAppController);
AppRouter.get('/appCategories',AppController.getAppCategory);
AppRouter.get('/authenticationType',AppController.getAuthenticationType)
AppRouter.get('/appNames',AppController.getAppNames);
AppRouter.get('/appnames/:appName',AppController.getConnectionLevelParams);

AppRouter.patch('/:appName',AppController.updateApp);
AppRouter.get('/:appName',AppController.getApp);
AppRouter.delete('/:appName',AppController.deleteApp);
AppRouter.post('/',AppController.createApp);
AppRouter.get('/',AppController.getAllApps);


module.exports = AppRouter;