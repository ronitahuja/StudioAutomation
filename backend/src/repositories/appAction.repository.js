const { AppActionModel } = require("../models");

class AppActionRepository {
  async createAppAction(appActionData) {
    try {
      const appAction = await AppActionModel.create({
        appActionName: appActionData.appActionName,
        language: appActionData.language,
        applicationName: appActionData.applicationName,
        transactionLevelParamFields: appActionData.transactionLevelParamFields,
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
