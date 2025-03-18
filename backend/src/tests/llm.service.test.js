const { pipeline } = require("@huggingface/transformers");
const LLMService = require("../services/llm.service");
const Groq = require("groq-sdk");
const { spawn } = require("child_process");
const dotenv = require("dotenv");
dotenv.config();

jest.mock("groq-sdk", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});

jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));

describe("LLMService", () => {
  let llmService, mockGroq;

  beforeEach(() => {
    mockGroq = new Groq();
    llmService = new LLMService("deepseek-r1-distill-qwen-32b");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should query LLM and return generated response", async () => {
    const mockResponse = {
      choices: [{ message: { content: "Generated response" } }],
    };
    mockGroq.chat.completions.create.mockResolvedValue(mockResponse);

    const result = await llmService.queryLLM("Test prompt");
    expect(mockGroq.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [{ role: "user", content: "Test prompt" }],
      })
    );
    expect(result).toBe("Generated response");
  });

  it("should handle errors in querying LLM", async () => {
    mockGroq.chat.completions.create.mockRejectedValue(new Error("LLM error"));
    await expect(llmService.queryLLM("Test prompt")).rejects.toThrow(
      "LLM error"
    );
  });

  it("should handle Python process execution", async () => {
    const mockStdout = '{"status": "success", "data": "some result"}';
    const mockProcess = {
      stdout: { on: jest.fn((event, callback) => callback(mockStdout)) },
      stderr: { on: jest.fn() },
      on: jest.fn((event, callback) => callback(0)),
    };

    spawn.mockReturnValue(mockProcess);

    await llmService.generateAppActionsScript({
      link: "test.com",
      query: "test query",
      model: "test-model",
    });
    expect(spawn).toHaveBeenCalledWith(process.env.VENV_PATH, [
      process.env.PYTHON_SCRIPT_PATH,
      expect.any(String),
    ]);
  });
});
