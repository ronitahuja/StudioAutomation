const { CodeVersionModel } = require("../models");

class codeVersionRepository {
  async insertCodeVersions(codeVersionsData) {
    try {
      const newCodeVersions = await CodeVersionModel.insertMany(codeVersionsData);
      return newCodeVersions;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = codeVersionRepository;