const AppService = require("../services/app.service");

// Mocking the AppRepository
const mockAppRepository = {
  createApp: jest.fn(),
  getAllApps: jest.fn(),
  getApp: jest.fn(),
  getAppCategory: jest.fn(),
  getAuthenticationType: jest.fn(),
  getAppNames: jest.fn(),
  getConnectionLevelParams: jest.fn(),
  updateApp: jest.fn(),
  deleteApp: jest.fn(),
};

describe("AppService", () => {
  let appService;

  beforeEach(() => {
    appService = new AppService(mockAppRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createApp", () => {
    it("should create a new app", async () => {
      const mockAppData = { name: "TestApp", category: "Utility" };
      mockAppRepository.createApp.mockResolvedValue(mockAppData);

      const result = await appService.createApp(mockAppData);

      expect(mockAppRepository.createApp).toHaveBeenCalledWith(mockAppData);
      expect(result).toEqual(mockAppData);
    });
  });

  describe("getAllApps", () => {
    it("should return all apps", async () => {
      const mockApps = [{ name: "App1" }, { name: "App2" }];
      mockAppRepository.getAllApps.mockResolvedValue(mockApps);

      const result = await appService.getAllApps();

      expect(result).toEqual(mockApps);
      expect(mockAppRepository.getAllApps).toHaveBeenCalled();
    });
  });

  describe("getApp", () => {
    it("should return app data if exists", async () => {
      const mockApp = { name: "TestApp" };
      mockAppRepository.getApp.mockResolvedValue(mockApp);

      const result = await appService.getApp("TestApp");

      expect(result).toEqual(mockApp);
      expect(mockAppRepository.getApp).toHaveBeenCalledWith("TestApp");
    });
  });

  describe("getAppCategory", () => {
    it("should return all app categories", async () => {
      const mockCategories = ["Utility", "Productivity"];
      mockAppRepository.getAppCategory.mockResolvedValue(mockCategories);

      const result = await appService.getAppCategory();

      expect(result).toEqual(mockCategories);
      expect(mockAppRepository.getAppCategory).toHaveBeenCalled();
    });
  });

  describe("getAuthenticationType", () => {
    it("should return all authentication types", async () => {
      const mockAuthTypes = ["OAuth", "API Key"];
      mockAppRepository.getAuthenticationType.mockResolvedValue(mockAuthTypes);

      const result = await appService.getAuthenticationType();

      expect(result).toEqual(mockAuthTypes);
      expect(mockAppRepository.getAuthenticationType).toHaveBeenCalled();
    });
  });

  describe("getAppNames", () => {
    it("should return all app names", async () => {
      const mockAppNames = ["App1", "App2"];
      mockAppRepository.getAppNames.mockResolvedValue(mockAppNames);

      const result = await appService.getAppNames();

      expect(result).toEqual(mockAppNames);
      expect(mockAppRepository.getAppNames).toHaveBeenCalled();
    });
  });

  describe("getConnectionLevelParams", () => {
    it("should return connection level parameters for an app", async () => {
      const mockParams = { param1: "value1" };
      mockAppRepository.getConnectionLevelParams.mockResolvedValue(mockParams);

      const result = await appService.getConnectionLevelParams("TestApp");

      expect(result).toEqual(mockParams);
      expect(mockAppRepository.getConnectionLevelParams).toHaveBeenCalledWith(
        "TestApp"
      );
    });
  });

  describe("updateApp", () => {
    it("should update an existing app", async () => {
      const mockUpdatedApp = { name: "UpdatedApp" };
      mockAppRepository.updateApp.mockResolvedValue(mockUpdatedApp);

      const result = await appService.updateApp(mockUpdatedApp);

      expect(result).toEqual(mockUpdatedApp);
      expect(mockAppRepository.updateApp).toHaveBeenCalledWith(mockUpdatedApp);
    });
  });

  describe("deleteApp", () => {
    it("should delete an app", async () => {
      const mockDeletedApp = { success: true };
      mockAppRepository.deleteApp.mockResolvedValue(mockDeletedApp);

      const result = await appService.deleteApp("TestApp");

      expect(result).toEqual(mockDeletedApp);
      expect(mockAppRepository.deleteApp).toHaveBeenCalledWith("TestApp");
    });
  });
});
