class AppService{
    constructor(appRepository){
        this.appRepository= appRepository;
    }
    async createApp(appData){
        const app = await this.appRepository.createApp(appData);
        return app;
    }
    async getAllApps(){
        const allApps = await this.appRepository.getAllApps();
        return allApps;
    }
    async getAppCategory(){
        const appCategories =  await this.appRepository.getAppCategory();
        return appCategories;
    }
    async getAuthenticationType(){
        const authenticationTypes = await this.appRepository.getAuthenticationType();
        return authenticationTypes;
    }
    async getAppNames(){
        const appNames = await this.appRepository.getAppNames();
        return appNames;
    }
    async getConnectionLevelParams(appName){
        const connectionLevelParams = await this.appRepository.getConnectionLevelParams(appName);
        return connectionLevelParams;
    }
}
module.exports = AppService;