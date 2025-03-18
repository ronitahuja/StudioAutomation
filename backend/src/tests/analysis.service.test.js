const AnalysisService = require("../services/analysis.service");

// Mocking the AnalysisRepository
const mockAnalysisRepository = {
  getAnalysis: jest.fn(),
  updateAnalysis: jest.fn(),
  getAllAnalysis: jest.fn(),
};

describe("AnalysisService", () => {
  let analysisService;

  beforeEach(() => {
    analysisService = new AnalysisService(mockAnalysisRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateAnalysis", () => {
    it("should create a new analysis entry if none exists", async () => {
      mockAnalysisRepository.getAnalysis.mockResolvedValue(null);

      await analysisService.updateAnalysis("modelA", true);

      expect(mockAnalysisRepository.getAnalysis).toHaveBeenCalledWith("modelA");
      expect(mockAnalysisRepository.updateAnalysis).toHaveBeenCalledWith(
        "modelA",
        { modelScore: 1 }
      );
    });

    it("should increment modelScore if like is true", async () => {
      mockAnalysisRepository.getAnalysis.mockResolvedValue({
        modelName: "modelA",
        modelScore: 2,
      });

      await analysisService.updateAnalysis("modelA", true);

      expect(mockAnalysisRepository.updateAnalysis).toHaveBeenCalledWith(
        "modelA",
        { modelScore: 3 }
      );
    });

    it("should decrement modelScore if like is false", async () => {
      mockAnalysisRepository.getAnalysis.mockResolvedValue({
        modelName: "modelA",
        modelScore: 2,
      });

      await analysisService.updateAnalysis("modelA", false);

      expect(mockAnalysisRepository.updateAnalysis).toHaveBeenCalledWith(
        "modelA",
        { modelScore: 1 }
      );
    });
  });

  describe("getAnalysis", () => {
    it("should return an empty object if no analysis exists", async () => {
      mockAnalysisRepository.getAnalysis.mockResolvedValue(null);

      const result = await analysisService.getAnalysis("modelA");

      expect(result).toEqual({});
    });

    it("should return the analysis data if it exists", async () => {
      const mockData = { modelName: "modelA", modelScore: 5 };
      mockAnalysisRepository.getAnalysis.mockResolvedValue(mockData);

      const result = await analysisService.getAnalysis("modelA");

      expect(result).toEqual(mockData);
    });
  });

  describe("getAllAnalysis", () => {
    it("should return all analysis data", async () => {
      const mockData = [
        { modelName: "modelA", modelScore: 5 },
        { modelName: "modelB", modelScore: 3 },
      ];
      mockAnalysisRepository.getAllAnalysis.mockResolvedValue(mockData);

      const result = await analysisService.getAllAnalysis();

      expect(result).toEqual(mockData);
      expect(mockAnalysisRepository.getAllAnalysis).toHaveBeenCalled();
    });
  });
});
