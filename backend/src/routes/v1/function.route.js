const express = require('express')

const {FunctionController} = require('../../controllers')

const FunctionRouter = express.Router();

FunctionRouter.get('/ping', FunctionController.pingFunctionController)
FunctionRouter.post('/',FunctionController.insertFunctions)
FunctionRouter.post('/search',FunctionController.vectorSearch)

module.exports = FunctionRouter;
