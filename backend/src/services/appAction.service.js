class AppActionService {
  constructor(appActionRepository) {
    this.appActionRepository = appActionRepository;
  }
  async createAppAction(appActionData) {
    const appAction = await this.appActionRepository.createAppAction(
      appActionData
    );
    return appAction;
  }
}
module.exports = AppActionService;
