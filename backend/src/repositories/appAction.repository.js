const { AppAction } = require("../models");

class AppActionRepository {
  async createAppAction(appActionData) {
    try {
      const appAction = await AppAction.create({
        appActionName: appActionData.appActionName,
        language: appActionData.language,
        applicationName: appActionData.applicationName,
        transcationLevelParamFields: appActionData.transcationLevelParamFields,
        code: appActionData.code,
        details: appActionData.details,
      });
      return appAction;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
module.exports = AppActionRepository;
