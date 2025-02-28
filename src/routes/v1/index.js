const express = require('express');

const functionRouter = require('./function.route');
const llmRouter = require('./llm.route');
const AppActionRouter = require('./appAction.route');

const v1Router = express.Router();

// If any request comes and route continues with /functions, we map it to functionRouter
v1Router.use('/functions', functionRouter);
v1Router.use('/llm',llmRouter);
v1Router.use('/appActions', AppActionRouter);

module.exports = v1Router;

