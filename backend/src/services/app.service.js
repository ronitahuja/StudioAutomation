class AppService{
    constructor(appRepository){
        this.appRepository= appRepository;
    }
    async createApp(appData){
        const app = await this.appRepository.createApp(appData);
        return app;
    }
}
module.exports = AppService;