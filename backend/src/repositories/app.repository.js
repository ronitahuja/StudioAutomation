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
    async getAllApps(){
        try{
            const allApps = await App.find({});
            return allApps;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
    async getApp(appName){
        try{
         
            const app = await App.findOne({appName});
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
    async getAppNames() {
        try {
            const appNames = await App.find({}, '_id appName'); // Fetches `_id` and `appName`
            return appNames;
        } catch (err) {
            console.error("Error fetching application names:", err);
            throw err;
        }
    }
    
    async getConnectionLevelParams(appName){
        try{
            const connectionLevelParams = await App.find(
                { appName }, 
                { connectionLevelParamFields: 1, _id: 0 } 
            );
           
            return connectionLevelParams;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
    async updateApp(updatedAppData){
        try{
            const id = updatedAppData._id;
            const updatedApp = await App.updateOne({
                _id: updatedAppData._id,

            })
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}
module.exports = AppRepository;