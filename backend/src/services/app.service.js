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
    async getApp(appName){
        const app = await this.appRepository.getApp(appName);
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
    async getAppNames(){
        const appNames = await this.appRepository.getAppNames();
        return appNames;
    }
    async getConnectionLevelParams(appName){
        const connectionLevelParams = await this.appRepository.getConnectionLevelParams(appName);
        return connectionLevelParams;
    }
    async updateApp(updatedAppData){
        const updatedApp = await this.appRepository.updateApp(updatedAppData);
        return updatedApp;
    }
    async deleteApp(appName){
        const deletedApp = await this.appRepository.deleteApp(appName);
        return deletedApp;
    }
}
module.exports = AppService;