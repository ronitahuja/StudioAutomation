const express = require("express");
const {AuthController} = require("../../controllers");

const AuthRouter = express.Router();

AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/register", AuthController.register);

module.exports = AuthRouter;