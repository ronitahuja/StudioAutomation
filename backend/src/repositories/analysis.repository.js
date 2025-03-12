const Analysis = require("../models/analysis.model");

class AnalysisRepository {
  async updateAnalysis(modelName, updatedData) {
    try {
      const analysis = await Analysis.findOneAndUpdate(
        { modelName },
        updatedData,
        { new: true, upsert: true }
      );
      return analysis;
    } catch (err) {
      console.error("Error in updateAnalysis:", err);
      throw err;
    }
  }

  async getAllAnalysis() {
    try {
      return await Analysis.find({});
    } catch (err) {
      console.error("Error in getAllAnalysis:", err);
      throw err;
    }
  }

  async getAnalysis(modelName) {
    try {
      return await Analysis.findOne({ modelName });
    } catch (err) {
      console.error("Error in getAnalysis:", err);
      throw err;
    }
  }
}

module.exports = AnalysisRepository;
