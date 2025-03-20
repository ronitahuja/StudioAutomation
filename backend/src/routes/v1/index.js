const express = require('express');

const functionRouter = require('./function.route');
const llmRouter = require('./llm.route');
const AppActionRouter = require('./appAction.route');
const AppRouter =  require('./app.route')
const AutoCompleteRouter = require('./autoComplete.route')
const AnalysisRouter=require('./analysis.route')
const AuthRouter = require('./auth.route');
const { verifyToken } = require('../../middleware/auth.middleware');


const v1Router = express.Router();


// If any request comes and route continues with /functions, we map it to functionRouter
v1Router.use('/functions',verifyToken, functionRouter);
v1Router.use('/llm',verifyToken,llmRouter);
v1Router.use('/appActions',verifyToken, AppActionRouter);
v1Router.use('/app',verifyToken,AppRouter);
v1Router.use('/autocomplete',verifyToken,AutoCompleteRouter);
v1Router.use('/analysis',verifyToken,AnalysisRouter);
v1Router.use('/auth', AuthRouter);


module.exports = v1Router;

