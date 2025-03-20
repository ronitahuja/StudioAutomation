class AuthService{
    constructor(authRepository){
        this.authRepository= authRepository;
    }
    async login(userData){
        const {email,password} =  userData;
        const loggedInUser = await this.authRepository.login(email,password);
        return loggedInUser;
    }
    async register(userData){
        const {firstName, lastName , email,password,confirmPassword} = userData;
        const registeredUser = await this.authRepository.register(firstName,lastName,email,password,confirmPassword);
        return registeredUser;
    }
}
module.exports = AuthService;