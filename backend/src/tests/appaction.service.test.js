const AppActionService = require("../services/appAction.service");

// Mocking the AppActionRepository
const mockAppActionRepository = {
  createAppAction: jest.fn(),
};

describe("AppActionService", () => {
  let appActionService;

  beforeEach(() => {
    appActionService = new AppActionService(mockAppActionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createAppAction", () => {
    it("should create a new app action", async () => {
      const mockAppActionData = {
        actionName: "TestAction",
        appName: "TestApp",
      };
      mockAppActionRepository.createAppAction.mockResolvedValue(
        mockAppActionData
      );

      const result = await appActionService.createAppAction(mockAppActionData);

      expect(mockAppActionRepository.createAppAction).toHaveBeenCalledWith(
        mockAppActionData
      );
      expect(result).toEqual(mockAppActionData);
    });
  });
});
