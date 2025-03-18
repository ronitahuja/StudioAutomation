const { generateEmbedding } = require("../services/embedding.service");
const { pipeline } = require("@huggingface/transformers");

jest.mock("@huggingface/transformers", () => ({
  pipeline: jest.fn(),
}));

let mockPipeline;

describe("generateEmbedding", () => {
  beforeEach(() => {
    mockPipeline = jest.fn(async (text, options) => ({
      data: [0.1, 0.2, 0.3], // Mock embedding output
    }));
    pipeline.mockResolvedValue(mockPipeline);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate embeddings for the given text", async () => {
    const text = "Hello, world!";
    const result = await generateEmbedding(text);

    expect(pipeline).toHaveBeenCalledWith(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    expect(mockPipeline).toHaveBeenCalledWith(text, {
      pooling: "mean",
      normalize: true,
    });
    expect(result).toEqual([0.1, 0.2, 0.3]);
  });

  it("should throw an error if embedding generation fails", async () => {
    mockPipeline.mockRejectedValueOnce(new Error("Embedding error"));

    await expect(generateEmbedding("Hello")).rejects.toThrow("Embedding error");
  });
});
