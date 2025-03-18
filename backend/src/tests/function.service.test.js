const { generateEmbedding } = require("../services/embedding.service");
const { pipeline } = require("@huggingface/transformers");
const FunctionService = require("../services/function.service");

jest.mock("@huggingface/transformers", () => ({
  pipeline: jest.fn(),
}));

let mockPipeline, mockFunctionRepository, functionService;

describe("FunctionService", () => {
  beforeEach(() => {
    mockPipeline = jest.fn(async (text, options) => ({
      data: [0.1, 0.2, 0.3], // Mock embedding output
    }));
    pipeline.mockResolvedValue(mockPipeline);

    mockFunctionRepository = {
      insertFunctions: jest.fn(),
      vectorSearch: jest.fn(),
    };
    functionService = new FunctionService(mockFunctionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should insert functions with embeddings", async () => {
    const functionsData = [
      {
        name: "testFunction",
        description: "A test function",
        syntax: "testFunction()",
        parameters: [{ name: "param1", type: "string" }],
        return_value: "string",
        example: "testFunction('hello')",
      },
    ];

    mockFunctionRepository.insertFunctions.mockResolvedValue(functionsData);

    const result = await functionService.insertFunctions(functionsData);

    expect(mockPipeline).toHaveBeenCalled();
    expect(mockFunctionRepository.insertFunctions).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: "testFunction",
          embedding: [0.1, 0.2, 0.3],
        }),
      ])
    );
    expect(result).toEqual(functionsData);
  });
});
