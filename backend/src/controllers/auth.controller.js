const {AuthService} =  require("../services");
const {AuthRepository} =  require("../repositories");
const {StatusCodes} = require("http-status-codes")

const authService = new AuthService(new AuthRepository());

function pingAuthController(req, res) {
    return res.json({message: "Auth Controller is up"});
}
async function login(req,res,next){
    try{
        const loggedInUser = await authService.login(req.body);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User logged in successfully",
            data: loggedInUser,
            err: {}
        });
    }
    catch(error){
        next(error);
    }
}
async function register(req,res,next){
    try{
        console.log("inside register");
        const registeredUser = await authService.register(req.body);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: registeredUser,
            err: {}
        });
    }
    catch(error){
        next(error);
    }
}
module.exports ={
    pingAuthController,
    login,
    register

}