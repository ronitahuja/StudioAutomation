const App = require("../models/app.model");

class AppRepository{
    async createApp(appData){
        try{
            const app = await App.create({
                appName : appData.appName,
                appCategory : appData.appCategory,
                authenticationType: appData.authenticationType,
                appDescription : appData.appDescription,
                connectionLevelParamFields: appData.connectionLevelParamFields
            })
            return app;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
    async getAppCategory(){
        try{
            const appCategories = ['payroll','travel','finance'];
            return appCategories;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
    async getAuthenticationType(){
        try{
            const authenticationTypes = ['No Auth','auth 2.0','basic auth'];
            return authenticationTypes;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}
module.exports = AppRepository;