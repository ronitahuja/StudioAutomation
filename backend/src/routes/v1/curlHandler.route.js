const express = require('express');
const CurlRouter = express.Router();
const {CurlHandlerController} = require('../../controllers')

CurlRouter.post('/curl',CurlHandlerController.pipeline)

module.exports = CurlRouter;

