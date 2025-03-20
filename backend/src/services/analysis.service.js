class AnalysisService {
  constructor(analysisRepository) {
    this.analysisRepository = analysisRepository;
  }
  async updateAnalysis(modelName,like) {
    try {
      const data = await this.analysisRepository.getAnalysis(modelName);

      if (data === null) {
        await this.analysisRepository.updateAnalysis(modelName, {
          modelScore: 1,
        });
      } else {
        if(like)data.modelScore += 1;
        else data.modelScore -= 1;
        await this.analysisRepository.updateAnalysis(data.modelName, {modelScore:data.modelScore});
      }
    } catch (err) {
      console.error("Error in analysis service:", err);
      throw err;
    }
  }
  async getAnalysis(modelName) {
    try {
      const data = await this.analysisRepository.getAnalysis(modelName);
      if (data === null) {
        return {};
      } else {
        return data;
      }
    } catch (err) {
      console.log("Error in analysis service", err);
      throw err;
    }
  }
  async getAllAnalysis() {
    try {
      return await this.analysisRepository.getAllAnalysis();
    } catch (err) {
      console.log("error in analysis service");
      throw err;
    }
  }
}
module.exports=AnalysisService;