class AppService{
    constructor(appRepository){
        this.appRepository= appRepository;
    }
    async createApp(appData){
        const app = await this.appRepository.createApp(appData);
        return app;
    }
    async getAppCategory(){
        const appCategories =  await this.appRepository.getAppCategory();
        return appCategories;
    }
    async getAuthenticationType(){
        const authenticationTypes = await this.appRepository.getAuthenticationType();
        return authenticationTypes;
    }
}
module.exports = AppService;