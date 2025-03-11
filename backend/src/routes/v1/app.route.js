const express = require('express');

const {AppController} =  require('../../controllers');

const AppRouter = express.Router();

//routes
AppRouter.get('/ping',AppController.pingAppController);
AppRouter.get('/appCategories',AppController.getAppCategory);
AppRouter.get('/authenticationType',AppController.getAuthenticationType)
AppRouter.get('/appNames',AppController.getAppNames);
AppRouter.get('/appnames/:appName',AppController.getConnectionLevelParams);
AppRouter.put('/appnames/:appName',AppController.updateApp);
AppRouter.delete('/appnames/:appName',AppController.deleteApp);
AppRouter.get('/:appName',AppController.getApp);
AppRouter.post('/',AppController.createApp);
AppRouter.get('/',AppController.getAllApps);


module.exports = AppRouter;